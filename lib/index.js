'use strict'

var path = require('path')
// var log = require('npmlog')
var config = require('../config')
var ip = require('ip')
var btoa = require('btoa')

module.exports = exports = Service

function Service (obsConfig) {
  this.config = config
  this.config.set({
    gitAuth: btoa(this.config.gitUsername.val + ':' + this.config.gitPassword.val)
  })
  if (this.config.callbackURL.length < 1) {
    this.config.set('callbackURL', 'http://' + ip.address() + ':' + this.config.port + '}/push')
  }
  if (this.config.subscriptions.filePath.length < 1) {
    this.config.set('subscriptions.filePath', path.join(__dirname, '..', 'runtime', 'subs.json'))
  }
}

Service.prototype.start = require('./start')
Service.prototype.setupWebhook = require('./setupwebhook')
