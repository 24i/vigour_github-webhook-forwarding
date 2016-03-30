'use strict'

var log = require('../../logger')

module.exports = exports = function () {
  return new Promise((resolve, reject) => {
    log.trace({
      server: this.config.server
    }, 'startingServer')
    this.handle = this.app.listen(this.config.server.port, resolve)
    log.info({server: this.config.server}, 'serverStarted')
    resolve()
  })
}
