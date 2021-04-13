const Sentry = require('@sentry/node')

module.exports = async (ctx, next) => {
  try {
    Sentry.getCurrentHub().configureScope(scope =>
      scope.addEventProcessor(event =>
        Sentry.Handlers.parseRequest(event, ctx.request, { user: false })
      )
    )
    await next()
  } catch (error) {
    ctx.status = error.status || 400
    ctx.body = {
      success: false,
      message: error.message
    }
    ctx.app.emit('error', error, ctx)
  }
}
