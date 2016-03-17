[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm version](https://badge.fury.io/js/vigour-config.svg)](https://badge.fury.io/js/vigour-config)
[![Build Status](https://travis-ci.org/vigour-io/github-webhook-forwarding.svg?branch=develop)](https://travis-ci.org/vigour-io/github-webhook-forwarding)

# github-webhook-forwarding
Forwards Github Webhooks to overcome the maximum number of webhooks allowed by Github (20)

## Usage

See [configure and launch your service](https://github.com/vigour-io/config#configure-and-launch-your-service) in [`vigour-config`](https://github.com/vigour-io/config#readme)

## `npm start`

This service needs to make authenticated requests to GitHub. You'll need to provide the following configuration options for `npm start` to work:

- `gitOwner` (`$GWF_OWNER`)
- `gitUsername` (`$GWF_USER`)
- `gitPassword` (`$GWF_PASS`)
- `subUser` (`$GWF_SUB_USER`)
- `subPass` (`$GWF_SUB_PASS`)

Other options are also available, check package.json[`vigour`] and see [usage](#usage)

### Warning

This is meant for a production environment where the ip returned by `ip.address()` is accessible to the outside world. On a local setup, the webhook will not reach. But the service will still create a WebHook on GitHub for the configured organization, taking one of only 20 available webhooks! Don't forget to remove it if you run `npm start` locally or if you're decommissioning an instance of the service. If you don't want to do this manually, use `npm run unhook`.

## `npm run unhook`

This gets the same config as `npm start`, but with `{ unhook: true }` (`--unhook true`), which means that instead of creating a hook if none exist for this ip and port, it will remove such a hook and exit

## `npm test`

Some of the tests also involve making authenticated requests to GitHub. We want those tests to work but we don't want to put the credentials in the repo. Instead, please set the following environment variables:

- `GWF_TEST_OWNER`
- `GWF_TEST_USER`
- `GWF_TEST_PASS`
- `GWF_TEST_PORT` (optional, default: `8000`)

example:
```sh
$ export GWF_TEST_OWNER=vigour
$ export GWF_TEST_USER=vigourbot
$ export GWF_TEST_PASS=OMGthisissoooooosecret
```

## Subscribing to GWF

To subscribe to GWF, make a `POST` request to `/subscribe?url=<YOUR_URL>` with Basic authentication (see [the server tests](test/node/server.js) for a complete example)
