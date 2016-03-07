'use strict'

var log = require('npmlog')
var Server = require('./server')
var removeThisHook = require('./github/removethishook')

module.exports = exports = function () {
  if (this.config.unhook.val) {
    return removeThisHook(this.config.plain())
  }
  this.server = new Server(this.config.plain())
  return this.server.start()
    .then(() => {
      return this.setupWebhook(this.config.plain())
    })
    .catch(function (reason) {
      log.error(':(', reason)
    })
}
