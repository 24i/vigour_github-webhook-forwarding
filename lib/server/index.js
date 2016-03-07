'use strict'

var express = require('express')
var handleWebhook = require('./handlewebhook')
var handleSubscription = require('./handlesubscription')
var fallback = require('./fallback')
var logRequest = require('./logrequest')
var authorize = require('./authorize')

module.exports = exports = Server

function Server (config) {
  this.config = config
  this.app = express()
  if (this.config.verbose) {
    this.app.use(logRequest)
  }
  this.app.post('/push', handleWebhook(this.config))
  this.app.post('/subscribe', authorize(this.config), handleSubscription(this.config.subsFilePath))
  this.app.use(fallback)
}

Server.prototype.start = require('./start')
