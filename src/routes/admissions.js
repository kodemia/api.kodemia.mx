const Router = require('koa-router')

const docuSign = require('../lib/docusign')

const router = new Router({
  prefix: '/admissions'
})

router.post('/calculator', async ctx => {
  let response = await docuSign.worker()
  console.log(response)
  ctx.resolve({
    message: 'success'
  })
})

module.exports = router
