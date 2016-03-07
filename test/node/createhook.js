'use strict'

var btoa = require('btoa')
var createHook = require('../../lib/github/createhook')
var removeHook = require('../../lib/github/removehook')
var removeThisHook = require('../../lib/github/removethishook')

describe('createhook', function () {
  var id
  var config = {
    gitOwner: process.env['GWF_TEST_OWNER'],
    gitAuth: btoa(process.env['GWF_TEST_USER'] +
      ':' + process.env['GWF_TEST_PASS']),
    callbackURL: 'http://thisdoesntexistitisatest.com'
  }
  before(function () {
    this.timeout(5000)
    return removeThisHook(config)
  })
  it('should return the hook id', function () {
    this.timeout(5000)
    return createHook(config)
      .then((_id) => {
        expect(_id).to.be.ok
        id = _id
      })
  })
  after(function () {
    this.timeout(5000)
    return removeHook(config, id)
  })
})
