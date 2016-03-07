'use strict'

var url = require('url')
var http = require('http')
var log = require('npmlog')
var fs = require('vigour-fs-promised')

module.exports = exports = function (config) {
  return function (req, res, next) {
    req.on('error', handleErr('req'))
    res.on('error', handleErr('res'))
    fs.readJSONAsync(config.subsFilePath)
      .then((subs) => {
        return Promise.all(subs.map((sub) => {
          return new Promise(function (resolve, reject) {
            var subParts = url.parse(sub)
            var forwardReqOptions = {
              method: 'POST',
              hostname: subParts.hostname,
              port: subParts.port,
              path: subParts.path,
              headers: req.headers
            }
            var forwardReq = http.request(forwardReqOptions, function (hookShotRes) {
              hookShotRes.on('error', handleErr('hookShotRes'))
              if (config.verbose) {
                log.info('forward request response', hookShotRes.statusCode, hookShotRes.statusMessage)
              }
              var total = ''
              hookShotRes.on('data', function (chunk) {
                total += chunk.toString()
              })
              hookShotRes.on('end', function () {
                if (config.verbose) {
                  log.info('forward request response body', total)
                }
                resolve(hookShotRes.statusCode)
              })
            })
            forwardReq.on('error', handleErr('forward request'))
            req.pipe(forwardReq)
          })
        })).then(function (results) {
          results.map(function (item) {
            if (item !== 202) {
              log.error('unexpected statusCode', item)
            }
          })
          finish(res)
        })
      }, (reason) => {
        if (reason.code === 'ENOENT') {
          log.warn('No subscriptions, ignoring webhook')
          finish(res)
        } else {
          throw reason
        }
      })
  }
}

function handleErr (tag) {
  return function (reason) {
    log.info(tag, reason)
  }
}

function finish (res) {
  res.status(202)
  res.end('ACCEPTED')
}
