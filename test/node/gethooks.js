'use strict'

var btoa = require('btoa')

var getHooks = require('../../lib/github/gethooks')

var requireTestConfig = require('../helpers/requiretestconfig')

describe('gethooks', function () {
  it('should return an array of hooks', function () {
    requireTestConfig()
    this.timeout(5000)
    var config = {
      gitOwner: process.env['GWF_TEST_OWNER'],
      gitAuth: btoa(process.env['GWF_TEST_USER'] +
        ':' + process.env['GWF_TEST_PASS'])
    }
    return getHooks(config).then((hooks) => {
      expect(hooks).instanceof(Array)
      hooks.map((item) => {
        expect(item.config.url).to.exist
      })
    })
  })
})
