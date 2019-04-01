const Router = require('koa-router')

const koders = require('./koders')
const generations = require('./generations')

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
  generations,
  root
}
