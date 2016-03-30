'use strict'

var url = require('url')
var log = require('../../logger')
var fs = require('vigour-fs-promised')
var responseBody = require('./responsebody')

module.exports = exports = function (subsFilePath) {
  return function (req, res, next) {
    var sub = req.query.url
    var parsed = url.parse(sub)
    if (!parsed.protocol || !parsed.host) {
      log.error({err: new Error('Invalid URL'), url: sub}, 'urlError')
      res.status(400).end(responseBody('Invalid URL'))
    } else {
      fs.existsAsync(subsFilePath)
        .then((exists) => {
          if (!exists) {
            log.debug({filePath: subsFilePath}, 'creatingSubscriptionFile')
            return fs.writeJSONAsync(subsFilePath, [], { mkdirp: true })
          }
        })
        .then(() => {
          fs.editJSONAsync(subsFilePath, function (subs) {
            log.debug({filePath: subsFilePath}, 'editSubscriptionFile')
            if (subs.indexOf(sub) === -1) {
              subs.push(sub)
              res.status(201)
            } else {
              res.status(200)
            }
            return subs
          }).then(() => {
            res.end()
          }, (reason) => {
            log.error({err: reason, filePath: subsFilePath}, 'handleSubscriptionError')
            res.status(500).end()
          })
        })
    }
  }
}
