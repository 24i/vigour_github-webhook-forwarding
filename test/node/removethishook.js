'use strict'

var btoa = require('btoa')
var createHook = require('../../lib/github/createhook')
var removeThisHook = require('../../lib/github/removethishook')

describe('removethishook', function () {
  var config = {
    gitOwner: process.env['GWF_TEST_OWNER'],
    gitAuth: btoa(process.env['GWF_TEST_USER'] +
      ':' + process.env['GWF_TEST_PASS']),
    callbackURL: 'http://thisdoesntexistitisatest.com'
  }
  before(function () {
    this.timeout(5000)
    return createHook(config)
  })
  it('should remove the hook with the specified callbackURL', function () {
    this.timeout(5000)
    return removeThisHook(config)
  })
})
