
const Router = require('koa-router')

const contacts = require('./contacts')

const router = new Router({
  prefix: '/active-campaign'
})

router.use(contacts.routes(), contacts.allowedMethods())

module.exports = router
