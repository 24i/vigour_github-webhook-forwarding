'use strict'

var log = require('npmlog')
var Server = require('./server')
var removeThisHook = require('./github/removethishook')

module.exports = exports = function () {
  if (this.config.unhook) {
    return removeThisHook(this.config)
  }
  this.server = new Server(this.config)
  return this.server.start()
    .then(() => {
      return this.setupWebhook(this.config)
    })
    .catch(function (reason) {
      log.error(':(', reason)
    })
}
