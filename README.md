# github-webhook-forwarding

Forwards Github Webhooks to overcome the limitation of only twemty (20) webhooks when using Github. 


## Usage

See [configure and launch your service] in [`vigour-config`].


## `npm start`

This service needs to make authenticated requests to GitHub. The configuration options `npm start` that **must be provided** include:

- `gitOwner` (`$GWF_OWNER`)
- `gitUsername` (`$GWF_USER`)
- `gitPassword` (`$GWF_PASS`)

Refer to [usage](#usage) or included [package.json (`vigour`)] for a complete set of options.

### Warning

This is meant for a production hosts where the ip returned by `ip.address()` is accessible to the outside world. On a local setup, the webhook will not reach. But the service will still create a WebHook on GitHub for the configured organization, allotting one of only 20 available webhooks! Don't forget to remove redundant or decommissioning instance of the service which can be done manually or via `npm run unhook`.


## `npm run unhook`

Reads the config similar to `npm start` with `{ unhook: true }` (`--unhook true`) to remove unused / specified hooks and thereafter exits.


## `npm test`

Some of the tests cases also require authenticated requests to GitHub. **Credentials like user names or password should not be stored** - instead they may bet set using environment variables:

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

To subscribe to GWF, make a `POST` request to `/subscribe?url=<YOUR_URL>` with Basic authentication (see [the server tests] for a complete example)


----

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm version](https://badge.fury.io/js/vigour-config.svg)](https://badge.fury.io/js/vigour-config)
[![Build Status](https://travis-ci.org/vigour-io/github-webhook-forwarding.svg?branch=develop)](https://travis-ci.org/vigour-io/github-webhook-forwarding)

---

  [the server tests]: <test/node/server.js>
  [configure and launch your service]: <https://github.com/vigour-io/config#configure-and-launch-your-service>
  [`vigour-config`]: <https://github.com/vigour-io/config#readme>
  [package.json (`vigour`)]: <https://github.com/vigour-io/github-webhook-forwarding/blob/master/package.json>