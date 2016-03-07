'use strict'

var url = require('url')
var log = require('npmlog')
var fs = require('vigour-fs-promised')
var responseBody = require('./responsebody')

module.exports = exports = function (subsFilePath) {
  return function (req, res, next) {
    var sub = req.query.url
    var parsed = url.parse(sub)
    if (!parsed.protocol || !parsed.host) {
      res.status(400).end(responseBody('Invalid URL'))
    } else {
      fs.editJSONAsync(subsFilePath, function (subs) {
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
        log.error('handleSubscription', reason)
        res.status(500).end()
      })
    }
  }
}
