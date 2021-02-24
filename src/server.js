const Koa = require('koa')
const cors = require('kcors')
const Router = require('koa-router')
const koaBody = require('koa-body')
const Sentry = require('@sentry/node')
const logger = require('./middlewares/logger')
const errorHandler = require('./middlewares/errorHandler')
const resolver = require('./middlewares/ctx/resolver')

const requestHandler = require('./middlewares/sentry/requestHandler')
const tracingMiddleWare = require('./middlewares/sentry/tracingMiddleWare')

const app = new Koa()
const rootRouter = new Router()
const environment = process.env.NODE_ENV || 'development'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0
})

let routers = require('./routes')

if (environment === 'production') {
  const helmet = require('koa-helmet')
  app.use(helmet())
}

routers = { rootRouter, ...routers }

app.use(cors())
app.use(koaBody({ multipart: true, formidable: { maxFileSize: 10000000 } }))
app.use(errorHandler)
app.use(resolver)
app.use(logger)

app.use(requestHandler)
app.use(tracingMiddleWare)

Object.values(routers)
  .map(router => app.use(router.routes()).use(router.allowedMethods()))

app.on('error', (err, ctx) => {
  console.error(`[ERROR] in (${ctx.path}): `, err)
  Sentry.withScope(function (scope) {
    scope.addEventProcessor(function (event) {
      return Sentry.Handlers.parseRequest(event, ctx.request)
    })
    Sentry.captureException(err)
  })
})

module.exports = app
