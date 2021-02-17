const Router = require('koa-router')

const contacts = require('./contacts')
const apply = require('./apply')
const companies = require('./companies')

const router = new Router({
  prefix: '/active-campaign'
})

router.use(contacts.routes(), contacts.allowedMethods())
router.use(apply.routes(), apply.allowedMethods())
router.use(companies.routes(), companies.allowedMethods())

module.exports = router
