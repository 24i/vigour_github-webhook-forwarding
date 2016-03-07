'use strict'

var getHooks = require('../../lib/github/gethooks')
var removeHook = require('../../lib/github/removehook')

module.exports = exports = function (config) {
  return getHooks(config)
    .then((hooks) => {
      return Promise.all(hooks.filter((item) => {
        if (item.config.url === config.callbackURL && item.events.indexOf('push') !== -1) {
          return true
        } else {
          return false
        }
      }).map((item) => {
        return removeHook(config, item.id)
      }))
    })
}
