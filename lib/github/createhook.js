'use strict'

var log = require('npmlog')
var sendRequest = require('./sendrequest')

module.exports = exports = function (config) {
  var payload = {
    method: 'POST',
    path: '/orgs/' + config.gitOwner + '/hooks',
    headers: {
      Authorization: 'Basic ' + config.gitAuth
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
  log.info('creating webhook', data)
  return sendRequest(config, payload, data, 201)
    .then((response) => {
      var location = response.headers.location
      var idx = location.lastIndexOf('/') + 1
      return location.slice(idx)
    })
}
