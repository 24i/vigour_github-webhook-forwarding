'use strict'

var log = require('../../logger')
var sendRequest = require('./sendrequest')

module.exports = exports = function (config) {
  var payload = {
    method: 'POST',
    path: '/orgs/' + config.git.owner + '/hooks',
    headers: {
      Authorization: 'Basic ' + config.git.auth
    }
  }
  var data = {
    name: 'web',
    config: {
      url: config.callbackURL,
      content_type: 'json'
    },
    events: ['push'],
    active: false
  }
  log.debug({webhook: data}, 'creatingWebhook')
  return sendRequest(config, payload, data, 201)
    .then((response) => {
      var location = response.headers.location
      var idx = location.lastIndexOf('/') + 1
      return location.slice(idx)
    })
}
