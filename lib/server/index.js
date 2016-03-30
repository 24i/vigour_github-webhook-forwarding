'use strict'

var express = require('express')
var handleWebhook = require('./handlewebhook')
var handleSubscription = require('./handlesubscription')
var fallback = require('./fallback')
// var logRequest = require('./logrequest')
var authorize = require('./authorize')
var status = require('./status')

module.exports = exports = Server

function Server (config) {
  var app = express()
  // status check
  app.get('/\\$api/status', status)
  // app endpoints
  app.post('/push', handleWebhook(config))
  app.post('/subscribe', authorize(config), handleSubscription(config.subsFilePath))
  app.use(fallback)
  this.app = app
  this.config = config
}

Server.prototype.start = require('./start')
