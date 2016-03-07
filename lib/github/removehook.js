'use strict'

var sendRequest = require('./sendrequest')

module.exports = exports = function (config, id) {
  var payload = {
    method: 'DELETE',
    path: '/orgs/' + config.gitOwner + '/hooks/' + id,
    headers: {
      Authorization: 'Basic ' + config.gitAuth
    }
  }
  return sendRequest(config, payload, false, 204)
}
