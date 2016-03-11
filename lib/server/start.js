'use strict'

var log = require('npmlog')

module.exports = exports = function () {
  return new Promise((resolve, reject) => {
    if (this.config.verbose) {
      log.info('Starting server')
    }
    this.handle = this.app.listen(this.config.port, resolve)
    log.info('Listening on localhost:', this.config.port)
    resolve()
  })
}
