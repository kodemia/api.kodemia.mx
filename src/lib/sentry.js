
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

function init() {
  return Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    integrations: [
      new Tracing.Integrations.Mongo()
    ]
  })
}

module.exports = { init }
