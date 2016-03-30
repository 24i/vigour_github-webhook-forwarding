'use strict'

var sendRequest = require('./sendrequest')

module.exports = exports = function (config, id) {
  var payload = {
    method: 'DELETE',
    path: '/orgs/' + config.git.owner + '/hooks/' + id,
    headers: {
      Authorization: 'Basic ' + config.git.auth
    }
  }
  return sendRequest(config, payload, false, 204)
}
