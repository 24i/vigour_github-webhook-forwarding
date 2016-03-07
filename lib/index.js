'use strict'

var path = require('path')
var log = require('npmlog')
var Config = require('vigour-config')
var ip = require('ip')
var btoa = require('btoa')

module.exports = exports = Service

function Service (obsConfig) {
  var myIP = ip.address()
  if (!(obsConfig instanceof Config)) {
    obsConfig = new Config(obsConfig)
  }
  this.config = obsConfig
  this.config.set({
    gitAuth: btoa(this.config.gitUsername.val + ':' + this.config.gitPassword.val),
    callbackURL: `http://${myIP}:${this.config.port.val}/push`
  })
  if (!this.config.subsFilePath.val) {
    this.config.set({
      subsFilePath: path.join(__dirname, '..', 'runtime', 'subs.json')
    })
  }
  var plain = this.config.plain()
  plain.gitAuth = '*************'
  log.info('config', plain)
}

Service.prototype.start = require('./start')
Service.prototype.setupWebhook = require('./setupwebhook')
