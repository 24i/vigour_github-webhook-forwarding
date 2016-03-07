'use strict'

var sendRequest = require('./sendrequest')

module.exports = exports = function (config) {
  var payload = {
    path: '/orgs/' + config.gitOwner + '/hooks',
    headers: {
      Authorization: 'Basic ' + config.gitAuth
    }
  }
  return sendRequest(config, payload, false, 200)
    .then((response) => {
      return JSON.parse(response.body)
    })
}
