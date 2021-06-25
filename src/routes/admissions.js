const Router = require('koa-router')

const docuSign = require('../lib/docusign')

const router = new Router({
  prefix: '/admissions'
})

router.post('/calculator', async ctx => {
  const { signerEmail, signerName } = ctx.request.body
  let response = await docuSign.worker(signerEmail, signerName)

  ctx.resolve({
    message: 'success',
    payload: {
      envelopeId: response
    }
  })
})

module.exports = router
