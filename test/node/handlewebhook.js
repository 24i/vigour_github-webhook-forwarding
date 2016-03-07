'use strict'

var path = require('path')
var http = require('http')
var log = require('npmlog')
var express = require('express')
var fs = require('vigour-fs-promised')
var handleWebhook = require('../../lib/server/handlewebhook')

var subsFileDir = path.join(__dirname, 'handleSubscriptionData')
var subsFilePath = path.join(subsFileDir, 'subscriptions.json')

var config = {
  subsFilePath: subsFilePath
}

var middleware = handleWebhook(config)

var gwfMockPort = 8000
var ports = [8003, 8004]
var subscriptions = ports.map(function (port) {
  return 'http://localhost:' + port + '/push'
})
var nb = subscriptions.length

describe('handlewebhook', function () {
  var count = 0
  var payloadStart = 'Bugs'
  var payloadEnd = ' Bunny'
  var payload = payloadStart + payloadEnd
  var mockHeaders = {
    host: 'localhost:' + gwfMockPort,
    connection: 'close',
    boom: 'AH!',
    'content-length': payload.length
  }
  before(function () {
    return fs.writeJSONAsync(subsFilePath, subscriptions, { mkdirp: true })
  })
  // git-spy mocks
  before(function () {
    return Promise.all(ports.map(function (port) {
      return new Promise(function (resolve, reject) {
        var app = express()
        app.post('/push', function (req, res, next) {
          count += 1
          var total = ''
          // log.info('req.headers', req.headers)
          // log.info('mockHeaders', mockHeaders)
          // expect(req.headers).to.deep.equal(mockHeaders)
          req.on('error', errHandler('git-spy req'))
          res.on('error', errHandler('git-spy res'))
          req.on('data', function (chunk) {
            total += chunk.toString()
          })
          req.on('end', function () {
            expect(total).to.equal(payload)
          })
          res.status(202)
          res.end('ACCEPTED')
        })
        app.listen(port, '127.0.0.1', resolve)
      })
    }))
  })
  // GWF mock
  before(function (done) {
    var app = express()
    app.post('/push', function (req, res, next) {
      middleware(req, res, next)
    }, function () {
      expect('next to be called').to.equal(false)
    })
    app.listen(gwfMockPort, '127.0.0.1', done)
  })
  it('should respond with 202', function (done) {
    // GitHub mock
    var req = http.request({
      method: 'POST',
      path: '/push',
      port: gwfMockPort,
      headers: mockHeaders
    }, function (res) {
      res.on('error', errHandler('GitHub mock response'))
      // log.info('GitHub mock getting response:', res.statusCode, res.statusMessage)
      expect(res.statusCode).to.equal(202)
      var total = ''
      res.on('data', function (chunk) {
        total += chunk.toString()
      })
      res.on('end', function () {
        expect(total).to.equal('ACCEPTED')
        done()
      })
    })
    req.on('error', errHandler('req'))
    req.write(payloadStart)
    req.write(payloadEnd)
    req.end()
  })
  it('should forward webhook to every subscriber', function () {
    expect(count).to.equal(nb)
  })
  after(function () {
    return fs.removeAsync(subsFileDir)
  })
  // after: close servers...
})

var errHandler = function (tag) {
  return function (reason) {
    log.error(tag, reason)
  }
}
