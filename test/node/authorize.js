'use strict'

var btoa = require('btoa')
var authorize = require('../../lib/server/authorize')
var user = 'Gromit'
var pass = 'Chees3!'
var wrongPass = 'theM00n!'
var config = {
  subUser: user,
  subPass: pass
}
var middleware = authorize(config)

describe('authorize', function () {
  it('should respond with 401 on invalid credentials', function (done) {
    var req = {
      headers: {
        authorization: 'Basic ' + btoa(user + ':' + wrongPass)
      }
    }
    var res = {
      status: function (code) {
        expect(code).to.equal(401)
        return {
          end: function () {
            setTimeout(function () {
              expect(count).to.equal(0)
              done()
            }, 100)
          }
        }
      }
    }
    var count = 0
    var next = function (req, res, next) {
      count += 1
    }
    middleware(req, res, next)
  })
  it('should call `next` on valid credentials', function (done) {
    var req = {
      headers: {
        authorization: 'Basic ' + btoa(user + ':' + pass)
      }
    }
    var count = 0
    var res = {
      status: function (code) {
        count += 1
        return {
          end: function () {
            expect('res.end to be called').to.equal(false)
            done()
          }
        }
      }
    }
    var next = function (req, res, next) {
      expect(count).to.equal(0)
      done()
    }
    middleware(req, res, next)
  })
})
