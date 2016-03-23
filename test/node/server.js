'use strict'

var path = require('path')
var http = require('http')
var log = require('npmlog')
var express = require('express')
var btoa = require('btoa')
var fs = require('vigour-fs-promised')
var Server = require('../../lib/server')

var subsFileDir = path.join(__dirname, 'handleSubscriptionData')
var subsFilePath = path.join(subsFileDir, 'subscriptions.json')

var gwf
var gwfPort = 50000
var subUser = 'Gromit'
var subPass = 'Chees3!'
var config = {
  subsFilePath: subsFilePath,
  port: gwfPort,
  subUser: subUser,
  subPass: subPass
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
    gwf = new Server(config)
    return gwf.start()
  })
  it('should accept subscriptions', function () {
    return Promise.all(ports.map(function (port) {
      return new Promise(function (resolve, reject) {
        var options = {
          method: 'POST',
          path: '/subscribe?url=http://localhost:' + port + '/push',
          port: gwfPort,
          headers: {
            authorization: 'Basic ' + btoa(subUser + ':' + subPass)
          }
        }
        // log.info('Subscribing', options)
        var req = http.request(options, function (res) {
          res.on('error', handleErr('subscribe res', reject))
          var total = ''
          res.on('data', function (chunk) {
            total += chunk.toString()
          })
          res.on('end', function () {
            expect(res.statusCode === 200 || res.statusCode === 201).to.equal(true)
            resolve()
          })
        })
        req.on('error', handleErr('subscribe req', reject))
        req.write('')
        req.end()
      })
    }))
  })
  it('should forward the request as-is to all subscribers', function (done) {
    var options = {
      method: 'POST',
      hostname: 'localhost',
      port: gwfPort,
      path: '/push',
      headers: mockHeaders
    }
    // log.info('Simulating a webhook', options, 'body:', mockBody)
    var req = http.request(options, function (res) {
      var total = ''
      res.on('error', handleErr('webhook sim res'))
      res.on('data', function (chunk) {
        total += chunk.toString()
      })
      res.on('end', function () {
        expect(res.statusCode).to.equal(202)
        expect(total).to.equal(responseBody)
        done()
      })
    })
    req.on('error', handleErr('webhook sim req'))
    req.write(mockBody)
    req.end()
  })
  it('should respond to `/$api/status` requests', function (done) {
    var options = {
      hostname: 'localhost',
      port: gwfPort,
      path: '/$api/status',
      headers: mockHeaders
    }
    // log.info('Simulating a `GET /$api/status` request', options)
    var req = http.request(options, function (res) {
      var total = ''
      res.on('error', handleErr('status res'))
      res.on('data', function (chunk) {
        total += chunk.toString()
      })
      res.on('end', function () {
        expect(res.statusCode).to.equal(200)
        expect(total).to.equal('')
        done()
      })
    })
    req.on('error', handleErr('status req'))
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
      // log.info('git-spy mock listening on ', port)
      testServers.push({
        app: app,
        handle: handle
      })
      resolve()
    })
  })
}

function handleErr (tag, reject) {
  return function (reason) {
    log.error(tag, reason)
    if (reject) {
      reject(reason)
    }
  }
}
