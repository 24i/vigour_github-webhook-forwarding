'use strict'

var log = require('npmlog')

module.exports = exports = function () {
  return new Promise((resolve, reject) => {
    log.info('Starting server')
    this.handle = this.app.listen(this.config.port, '127.0.0.1', resolve)
    log.info('Listening on localhost:', this.config.port)
    resolve()
  })
}
