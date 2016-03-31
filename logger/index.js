'use strict'
var bunyan = require('bunyan')

// Read config for logger
var config = require('../config')
var logConfig = config.logger
var setConfig = {
  name: logConfig.name,
  level: logConfig.level
}

module.exports = bunyan.createLogger(setConfig)
