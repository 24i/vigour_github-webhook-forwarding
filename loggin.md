Logging
============

## Environment Configuration

| Environment | App Name | Log Level | Log level description |
| ----------- | -------- | --------- | --------------------- |
| Development | adm-scraper-dev | TRACE | Logging from external libraries used by your app or very detailed application logging. |
| Test | adm-scraper-test | TRACE | Logging from external libraries used by your app or very detailed application logging. |
| Staging | adm-scraper-staging | INFO | Detail on regular operation. |
| Production | adm-scraper | ERROR | Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish). |

More details about log levels: https://github.com/trentm/node-bunyan#levels

## GWF Messages

| Level | Message | Explanation |
| ----- | ------- | ----------- |
| ERROR | githubSendRequestError | An error `err` occured while making request `req` to github |
| ERROR | handleSubscriptionError | An error `err` occured while handling subscriptions for file `filePath` |
| ERROR | handleWebhookError | An error `err` on type `type` occured while handling webhooks |
| ERROR | startingServerError | An error `err` occured while starting the server `server` |
| ERROR | webhookForwardRequestError | An error `err` occured while forwarding a request to `req` |
| ERROR | urlError | An error `err` occured in setting the url `url` |
| WARN | webhookNoSubscriptionsSet | There are no subscriptions set for the webhook, therefore ignoring the webhook |
| INFO | serverStarted | The server is started with config `server` |
| DEBUG | creatingSubscriptionFile | Created file `filePath` for subscription |
| DEBUG | creatingWebhook | Creating webhook with config `webhook` |
| DEBUG | editSubscriptionFile | Edited JSON in file `filePath` for Subscription |
| DEBUG | githubSendingRequest | Sending request `req` with data `data` to github |
| DEBUG | hookAlreadySet | There already is a hook `hook` set |
| DEBUG | webhookForwardRequestResponseContent | The Webhook forward request `req` response is finished with content `content` |
| TRACE | serverRequest | The server got request `req` |
| TRACE | startingServer | The server is starting with config `server` |
| TRACE | webhookForwardRequestResponse | The Webhook forward request `req` responded with `res` |

