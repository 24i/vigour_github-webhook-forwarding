'use strict'

var path = require('path')
var config = require('../config')
var ip = require('ip')
var btoa = require('btoa')

module.exports = exports = Service

function Service (obsConfig) {
  this.config = config
  this.config.git.auth = btoa(this.config.git.username + ':' + this.config.git.password)

  if (this.config.callbackURL.length < 1) {
    if (this.config.server.host.length < 1) {
      this.config.server.host = ip.address()
    }
    this.config.callbackURL = 'http://' + this.config.server.host + ':' + this.config.server.port + '/push'
  }
  if (this.config.subscriptions.filePath.length < 1) {
    this.config.subscriptions.filePath = path.join(__dirname, '..', 'runtime', 'subs.json')
  }
}

Service.prototype.start = require('./start')
Service.prototype.setupWebhook = require('./setupwebhook')
