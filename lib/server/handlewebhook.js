'use strict'

var url = require('url')
var http = require('http')
var log = require('npmlog')
var fs = require('vigour-fs-promised')

module.exports = exports = function (subsFilePath) {
  return function (req, res, next) {
    req.on('error', handleErr('req'))
    res.on('error', handleErr('res'))
    fs.readJSONAsync(subsFilePath)
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
              log.info('forward request response', hookShotRes.statusCode, hookShotRes.statusMessage)
              var total = ''
              hookShotRes.on('data', function (chunk) {
                total += chunk.toString()
              })
              hookShotRes.on('end', function () {
                log.info('forward request response body', total)
                resolve(hookShotRes.statusCode)
              })
            })
            forwardReq.on('error', handleErr('forward request'))
            req.pipe(forwardReq)
          })
        })).then(function (results) {
          log.info('all done', results)
          results.map(function (item) {
            if (item !== 202) {
              log.error('unexpected statusCode', item)
            }
          })
          res.status(202)
          res.end('ACCEPTED')
        })
      })
  }
}

function handleErr (tag) {
  return function (reason) {
    log.info(tag, reason)
  }
}
