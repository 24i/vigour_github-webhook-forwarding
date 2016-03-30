'use strict'

var log = require('../../logger')

module.exports = exports = function (req, res, next) {
  log.trace({req: req}, 'serverRequest')
  next()
}
