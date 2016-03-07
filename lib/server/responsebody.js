'use strict'

module.exports = exports = function (msg) {
  return JSON.stringify({
    message: msg,
    documentation_url: 'https://github.com/vigour-io/github-webhook-forwarding#readme'
  }, null, 2)
}
