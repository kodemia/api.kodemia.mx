// this tracing middleware creates a transaction per request
const Sentry = require('@sentry/node')
const {
  extractTraceparentData,
  stripUrlQueryAndFragment
} = require('@sentry/tracing')

module.exports = async (ctx, next) => {
  const reqMethod = (ctx.method || '').toUpperCase()
  const reqUrl = ctx.url && stripUrlQueryAndFragment(ctx.url)
  // connect to trace of upstream app
  let traceparentData
  if (ctx.request.get('sentry-trace')) {
    traceparentData = extractTraceparentData(ctx.request.get('sentry-trace'))
  }

  const transaction = Sentry.startTransaction({
    name: `${reqMethod} ${reqUrl}`,
    op: 'http.server',
    ...traceparentData
  })

  ctx.__sentry_transaction = transaction
  await next()

  if (ctx._matchedRoute) {
    const mountPath = ctx.mountPath || ''
    transaction.setName(`${reqMethod} ${mountPath}${ctx._matchedRoute}`)
  }
  transaction.setHttpStatus(ctx.status)
  transaction.finish()
}
