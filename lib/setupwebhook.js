'use strict'

var log = require('npmlog')
var _find = require('lodash.find')
var getHooks = require('./github/gethooks')
var createHook = require('./github/createhook')

module.exports = exports = function (config) {
  return getHooks(config)
    .then((hooks) => {
      var pushHook = _find(hooks, (hook) => {
        return hook.config.url === config.callbackURL
      })
      if (!pushHook) {
        return createHook(config)
      } else {
        log.info('We already have a hook :)')
      }
    })
}
