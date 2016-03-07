'use strict'

var responsebody = require('../../lib/server/responsebody')

describe('responsebody', function () {
  it('should return an object with message and documentation_url', function () {
    var msg = 'Boom'
    var expected = JSON.stringify({
      message: msg,
      documentation_url: 'https://github.com/vigour-io/github-webhook-forwarding#readme'
    }, null, 2)
    var result = responsebody(msg)
    expect(result).to.equal(expected)
  })
})
