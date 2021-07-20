const Router = require('koa-router')
const { sendTemplate } = require('../usecases/sirena')

const router = new Router({
  prefix: '/sirena'
})

router.get('/', ctx => {
  ctx.resolve({
    message: 'endppoint sirema'
  })
})

router.post('/send-message', async ctx => {
  console.log(ctx.request.body)
  const { email } = ctx.request.body

  if (!email) throw ctx.throw(400, 'Email is required')
  const response = await sendTemplate(email)
  console.log(response)
  ctx.resolve({
    message: email
  })
})

module.exports = router
