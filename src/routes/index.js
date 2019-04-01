const Router = require('koa-router')

const koders = require('./koders')
const generations = require('./generations')
const mentors = require('./mentors')
const streams = require('./streams')

const root = new Router({
  prefix: '/'
})

root.get('/', ctx => {
  ctx.body = {
    success: true,
    message: 'Kodemia API v1',
    version: '1.0.0'
  }
})

module.exports = {
  koders,
  mentors,
  generations,
  streams,
  root
}
