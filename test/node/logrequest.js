'use strict'

var logrequest = require('../../lib/server/logrequest')

describe('logrequest', function () {
  it('should call `next`', function () {
    var count = 0
    var req = {
      method: 'GET',
      originalUrl: '/whatver.duh?bang=big'
    }
    var res = void 0
    var next = function () {
      count += 1
    }
    logrequest(req, res, next)
    expect(count).to.equal(1)
  })
})
