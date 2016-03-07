'use strict'

var path = require('path')
var fs = require('vigour-fs-promised')
var responseBody = require('../../lib/server/responsebody')
var handleSubscription = require('../../lib/server/handlesubscription')

var subsFileDir = path.join(__dirname, 'handleSubscriptionData')
var subsFilePath = path.join(subsFileDir, 'subscriptions.json')
var middleware = handleSubscription(subsFilePath)

var validUrl = 'http://perdu.com:80/'

describe('handlesubscription', function () {
  describe('handling bad requests', function () {
    it('should fail on invalid URLs', function () {
      var endCount = 0
      var req = {
        query: {
          url: 'not a valid url'
        }
      }
      var res = {
        status: function (code) {
          expect(code).to.equal(400)
          return {
            end: function (body) {
              endCount += 1
              expect(body).to.equal(responseBody('Invalid URL'))
            }
          }
        }
      }
      var next = void 0
      middleware(req, res, next)
      expect(endCount).to.equal(1)
    })
  })
  describe('handling valid requests', function () {
    before(function () {
      return fs.writeJSONAsync(subsFilePath, [], { mkdirp: true })
    })
    it('should create `subscriptions.json` and add subscription', function (done) {
      var statusCount = 0
      var endCount = 0
      var req = {
        query: {
          url: validUrl
        }
      }
      var res = {
        status: function (code) {
          statusCount += 1
          expect(code).to.equal(201)
        },
        end: function () {
          endCount += 1
        }
      }
      var next = void 0
      middleware(req, res, next)
      setTimeout(function () {
        expect(statusCount).to.equal(1)
        expect(endCount).to.equal(1)
        fs.readJSONAsync(subsFilePath)
          .then((contents) => {
            expect(contents).to.deep.equal([validUrl])
            done()
          })
      }, 100)
    })
    it('should succeed if subscription already exists', function (done) {
      var statusCount = 0
      var endCount = 0
      var req = {
        query: {
          url: validUrl
        }
      }
      var res = {
        status: function (code) {
          statusCount += 1
          expect(code).to.equal(200)
        },
        end: function () {
          endCount += 1
        }
      }
      var next = void 0
      middleware(req, res, next)
      setTimeout(function () {
        expect(statusCount).to.equal(1)
        expect(endCount).to.equal(1)
        done()
      }, 100)
    })
  })
  after(function () {
    return fs.removeAsync(subsFileDir)
  })
})
