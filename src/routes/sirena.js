const Router = require('koa-router')
const { sendFirstMessage } = require('../usecases/sirena')
const ac = require('../usecases/active-campaign')

const router = new Router({
  prefix: '/sirena'
})

router.post('/messages/first', async ctx => {
  const {
    firstName,
    lastName,
    email,
    phone,
    id,
    source,
    campaignName
  } = ctx.request.body

  if (!firstName) throw ctx.throw(400, 'firstName is required')
  if (!lastName) throw ctx.throw(400, 'lastName is required')
  if (!id) throw ctx.throw(400, 'contact id is required')
  if (!email) throw ctx.throw(400, 'email is required')
  if (!phone) throw ctx.throw(400, 'phone is required')

  await sendFirstMessage(firstName, lastName, phone, email, source, campaignName)
  await ac.deals.updateDealStage(id)

  ctx.resolve({
    message: 'Message sent and deal stage updated'
  })
})

module.exports = router
