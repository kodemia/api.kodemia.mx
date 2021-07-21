const Router = require('koa-router')
const { sendTemplate } = require('../usecases/sirena')

const router = new Router({
  prefix: '/sirena'
})

router.post('/send-message', async ctx => {
  const { email } = ctx.request.body

  if (!email) throw ctx.throw(400, 'Email is required')
  const response = await sendTemplate(email)

  ctx.resolve({
    message: 'Message sent',
    payload: response
  })
})

module.exports = router
