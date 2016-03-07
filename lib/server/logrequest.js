'use strict'

var log = require('npmlog')

module.exports = exports = function (req, res, next) {
  log.info(req.method, req.originalUrl)
  next()
}
