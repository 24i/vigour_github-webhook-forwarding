'use strict'

var express = require('express')
var handleWebhook = require('./handlewebhook')
var handleSubscription = require('./handlesubscription')
var fallback = require('./fallback')
var logRequest = require('./logrequest')
var authorize = require('./authorize')

module.exports = exports = Server

function Server (config) {
  var app = express()
  if (config.verbose) {
    app.use(logRequest)
  }
  // status check
  app.get('/$api/status', function (req, res) {
    res.status(200).send()
  })
  // app endpoints
  app.post('/push', handleWebhook(config))
  app.post('/subscribe', authorize(config), handleSubscription(config.subsFilePath))
  app.use(fallback)
  this.app = app
  this.config = config
}

Server.prototype.start = require('./start')
