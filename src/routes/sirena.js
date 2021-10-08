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
    campaignName } = ctx.request.body

  if (!firstName) throw ctx.throw(400, 'FirstName is required')
  if (!lastName) throw ctx.throw(400, 'LastName is required')
  if (!id) throw ctx.throw(400, 'Contact id is required')
  if (!email) throw ctx.throw(400, 'Email is required')
  if (!phone) throw ctx.throw(400, 'Phone is required')
  if (!source && !campaignName) throw ctx.throw(400, 'Source or campaignName is required')

  await sendFirstMessage(firstName, lastName, phone, email, source, campaignName)
  await ac.deals.updateDealStage(id)

  ctx.resolve({
    message: 'Message sent and deal stage updated'
  })
})

module.exports = router
