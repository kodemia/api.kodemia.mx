const Router = require('koa-router')
const { sendFirstMessage } = require('../usecases/sirena')
const ac = require('../usecases/active-campaign')

const router = new Router({
  prefix: '/sirena'
})

router.post('/messages/first', async ctx => {
  const { email, id } = ctx.request.body

  if (!id) throw ctx.throw(400, 'contact id is required')
  if (!email) throw ctx.throw(400, 'Email is required')

  await sendFirstMessage(email)
  await ac.deals.updateDealStage(id)

  ctx.resolve({
    message: 'Message sent and deal stage updated'
  })
})

module.exports = router
