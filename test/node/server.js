'use strict'

var path = require('path')
var http = require('http')
var log = require('npmlog')
var express = require('express')
var fs = require('vigour-fs-promised')
var Server = require('../../lib/server')

var subsFileDir = path.join(__dirname, 'handleSubscriptionData')
var subsFilePath = path.join(subsFileDir, 'subscriptions.json')

var gwf
var gwfPort = 50000
var config = {
  subsFilePath: subsFilePath,
  port: gwfPort
}
var ports = [
  8001,
  8002
]
var testServers = []
var mockBody = 'Hellllooooo there!'
var mockHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Content-Length': mockBody.length
}
var responseBody = 'ACCEPTED'

describe('server', function () {
  before(function () {
    return Promise.all(ports.map((port) => {
      return launchTestServer(port)
    }))
  })
  before(function () {
    return fs.writeJSONAsync(subsFilePath, ports.map((port) => {
      return 'http://localhost:' + port + '/push'
    }), { mkdirp: true })
  })
  before(function () {
    gwf = new Server(config)
    return gwf.start()
  })
  it('should forward the request as-is to all subscribers', function (done) {
    var options = {
      method: 'POST',
      hostname: 'localhost',
      port: gwfPort,
      path: '/push',
      headers: mockHeaders
    }
    log.info('simulating a webhook', options, 'body:', mockBody)
    var req = http.request(options, function (res) {
      var total = ''
      res.on('error', function (reason) {
        log.error('response failed', reason)
      })
      res.on('data', function (chunk) {
        total += chunk.toString()
      })
      res.on('end', function () {
        log.info('total', total)
        expect(res.statusCode).to.equal(202)
        expect(total).to.equal(responseBody)
        done()
      })
    })
    req.on('error', function (reason) {
      log.error('request failed', reason)
    })
    req.write(mockBody)
    req.end()
  })
  // after(function (done) {
  //   gwf.handle.close(done)
  // })
  // after(function () {
  //   return Promise.all(testServers.map((testServer) => {
  //     return new Promise(function (resolve, reject) {
  //       testServer.handle.stop(resolve)
  //     })
  //   }))
  // })
  after(function () {
    return fs.removeAsync(subsFileDir)
  })
})

function launchTestServer (port) {
  return new Promise(function (resolve, reject) {
    var app = express()
    app.post('/push', function (req, res, next) {
      var total = ''
      req.on('data', function (chunk) {
        total += chunk.toString()
      })
      req.on('end', function () {
        expect(total).to.deep.equal(mockBody)
        res.status(202).end(responseBody)
      })
    })
    var handle = app.listen(port, '127.0.0.1', function () {
      testServers.push({
        app: app,
        handle: handle
      })
      resolve()
    })
  })
}
