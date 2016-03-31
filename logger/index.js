'use strict'
var bunyan = require('bunyan')
var bunyanLogentries = require('bunyan-logentries')

// Read config for logger
var config = require('../config')
var logConfig = config.logger
var setConfig = {
  name: logConfig.name,
  level: logConfig.level
}
if (!config.debug) {
  var streams = []
  if (logConfig.logentries && logConfig.logentries.token && logConfig.logentries.token.length > 0) {
    var leLevel = (logConfig.logentries.level && logConfig.logentries.level.length > 0) ? logConfig.logentries.level : 'warn'
    streams.push({
      level: leLevel,
      stream: bunyanLogentries.createStream({token: logConfig.logentries.token, bufferSize: 1024}),
      type: 'raw'
    })
  }

  if (streams.length > 0) {
    setConfig.streams = streams
  }
}

module.exports = bunyan.createLogger(setConfig)
