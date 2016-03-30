'use strict'
module.exports = {
  debug: {
    doc: 'Application in debug mode',
    format: Boolean,
    default: false,
    env: 'DEBUG',
    arg: 'debug'
  },
  env: {
    doc: 'The applicaton environment.',
    format: ['develop', 'test', 'staging', 'production'],
    default: 'develop',
    env: 'NODE_ENV',
    arg: 'node-env'
  },
  logger: {
    name: {
      doc: 'The name of the application to be used in the logger',
      format: String,
      default: 'gwf',
      env: 'GWF_LOG_APPNAME'
    },
    level: {
      doc: 'The log level to output.',
      format: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
      default: 'debug',
      env: 'GWF_LOG_LEVEL'
    },
    logentries: {
      token: {
        doc: 'The token for logentries',
        format: String,
        default: 'b884b85d-548b-4338-a891-1d8730ec76f6',
        env: 'GWF_LOG_LE_TOKEN'
      },
      level: {
        doc: 'The log level to stream to logentries',
        format: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
        default: 'info',
        env: 'GWF_LOG_LE_LEVEL'
      }
    }
  },
  port: {
    doc: 'Port on which to listen for subscriptions and GitHub webhooks',
    format: Number,
    default: 50000,
    env: 'GWF_PORT',
    arg: 'port'
  },
  callbackURL: {
    doc: 'The URL to tell GitHub to POST Webhooks to',
    format: String,
    default: '',
    env: 'GWF_CALLBACK_URL'
  },
  git: {
    owner: {
      doc: 'Owner or organization name on which to listen',
      format: String,
      default: null,
      env: 'GWF_OWNER'
    },
    username: {
      doc: 'Username for authentication with GitHub',
      format: String,
      default: null,
      env: 'GWF_USER'
    },
    password: {
      doc: 'Password for authentication with GitHub',
      format: String,
      default: null,
      env: 'GWF_PASS'
    }
  },
  subscriptions: {
    filePath: {
      doc: 'Full path and file name of subscription storage file. defaults to `path.join(__dirname, \'..\', \'runtime\', \'subs.json\')`',
      format: String,
      default: '',
      env: 'GWF_SUBS_FILE'
    },
    username: {
      doc: 'Username subscribers should use to authenticate subscription requests',
      format: String,
      default: null,
      env: 'GWF_SUB_USER'
    },
    password: {
      doc: 'Password subscribers should use to authenticate subscription requests',
      format: String,
      default: null,
      env: 'GWF_SUB_PASS'
    }
  },
  unhook: {
    doc: 'Set to `true` to remove the hook that would otherwise be created by starting the service',
    format: Boolean,
    default: false,
    env: 'GWF_UNHOOK'
  }
}
