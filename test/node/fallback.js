'use strict'

var fallback = require('../../lib/server/fallback')

describe('fallback', function () {
  it('should 404', function () {
    var count = 0
    var req = void 0
    var res = {
      status: function (code) {
        expect(code).to.equal(404)
        return {
          end: function () {
            count += 1
          }
        }
      }
    }
    var next = void 0
    fallback(req, res, next)
    expect(count).to.equal(1)
  })
})
