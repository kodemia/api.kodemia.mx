const Router = require('koa-router')

const activeCampaign = require('./active-campaign')
const auth = require('./auth')
const classes = require('./classes')
const generations = require('./generations')
const koders = require('./koders')
const mentors = require('./mentors')
const streams = require('./streams')
const platform = require('./admissions')

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
  activeCampaign,
  auth,
  classes,
  koders,
  mentors,
  generations,
  root,
  streams,
  platform
}
