const Router = require('koa-router')

const activeCampaign = require('./active-campaign')
const admissions = require('./admissions')
const auth = require('./auth')
const classes = require('./classes')
const events = require('./events')
const generations = require('./generations')
const invitations = require('./invitations')
const koders = require('./koders')
const mentors = require('./mentors')
const streams = require('./streams')
const sirena = require('./sirena')

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
  admissions,
  auth,
  classes,
  events,
  generations,
  invitations,
  koders,
  mentors,
  root,
  streams,
  sirena
}
