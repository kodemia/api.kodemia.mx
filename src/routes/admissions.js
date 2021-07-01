const Router = require('koa-router')

const docuSign = require('../lib/docusign')

const router = new Router({
  prefix: '/admissions'
})

router.post('/offer', async ctx => {
  let { signerEmail, signerName, offerLetter } = ctx.request.body
  offerLetter = {
    signerName,
    ...offerLetter,
    startBootcamp: "06/07/2021"
  }
  let response = await docuSign.worker(signerEmail, signerName, offerLetter)

  ctx.resolve({
    message: 'success',
    payload: {
      envelopeId: response
    }
  })
})

module.exports = router
