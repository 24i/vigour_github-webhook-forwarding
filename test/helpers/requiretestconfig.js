'use strict'

var log = require('npmlog')

module.exports = exports = function () {
  if (!process.env['GWF_TEST_OWNER'] ||
    !process.env['GWF_TEST_USER'] ||
    !process.env['GWF_TEST_PASS']) {
    var error = new Error('Invalid Config')
    error.info = 'Missing the $GWF_TEST_OWNER, $GWF_TEST_USER and/or $GWF_TEST_PASS environment variables'
    error['documentation_url'] = 'https://github.com/vigour-io/github-webhook-forwarding#readme'
    log.error("Can't perform tests", error)
    throw error
  }
}
