
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

function init () {
  const environment = process.env.VERCEL_ENV || process.env.NODE_ENV

  return Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment,
    integrations: [
      new Tracing.Integrations.Mongo()
    ]
  })
}

module.exports = { init }
