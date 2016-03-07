'use strict'

var auth = require('basic-auth')

module.exports = exports = function (config) {
  return function name (req, res, next) {
    var credentials = auth(req)
    if (!credentials || credentials.name !== config.subUser || credentials.pass !== config.subPass) {
      res.status(401).end('Unauthorized')
    } else {
      next()
    }
  }
}
