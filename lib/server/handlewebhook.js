'use strict'

var url = require('url')
var http = require('http')
var log = require('../../logger')
var fs = require('vigour-fs-promised')

module.exports = exports = function (config) {
  return function (req, res, next) {
    req.on('error', function (err) {
      log.error({err: err, req: req}, 'handleWebhookError')
    })
    res.on('error', function (err) {
      log.error({err: err, res: res}, 'handleWebhookError')
    })
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
              hookShotRes.on('error', function (err) {
                log.error({err: err, res: hookShotRes, type: 'hookShot'}, 'handleWebhookError')
              })
              log.trace({req: forwardReqOptions, res: hookShotRes}, 'webhookForwardRequestResponse')
              var total = ''
              hookShotRes.on('data', function (chunk) {
                total += chunk.toString()
              })
              hookShotRes.on('end', function () {
                log.debug({req: forwardReqOptions, content: total}, 'webhookForwardRequestResponseContent')
                resolve(hookShotRes.statusCode)
              })
            })
            forwardReq.on('error', function (err) {
              log.error({err: err, req: forwardReqOptions}, 'webhookForwardRequestError')
            })
            req.pipe(forwardReq)
          })
        })).then(function (results) {
          results.map(function (item) {
            if (item !== 202) {
              log.error({err: new Error('Unexpected statusCode ' + item + ' !== 202')}, 'handleWebhookError')
            }
          })
          finish(res)
        }, function () {
          finish(res)
        })
      }, (reason) => {
        if (reason.code === 'ENOENT') {
          log.warn('webhookNoSubscriptionsSet')
          finish(res)
        } else {
          throw reason
        }
      })
  }
}

function finish (res) {
  res.status(202)
  res.end('ACCEPTED')
}
