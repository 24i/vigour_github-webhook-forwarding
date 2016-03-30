'use strict'

var path = require('path')
// var log = require('npmlog')
var config = require('../config')
var ip = require('ip')
var btoa = require('btoa')

module.exports = exports = Service

function Service (obsConfig) {
  this.config = config
  this.config.git.auth = btoa(this.config.git.username + ':' + this.config.git.password)

  if (this.config.callbackURL.length < 1) {
    this.config.callbackURL = 'http://' + ip.address() + ':' + this.config.port + '/push'
  }
  if (this.config.subscriptions.filePath.length < 1) {
    this.config.subscriptions.filePath = path.join(__dirname, '..', 'runtime', 'subs.json')
  }
}

Service.prototype.start = require('./start')
Service.prototype.setupWebhook = require('./setupwebhook')
