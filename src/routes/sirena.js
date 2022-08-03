const Router = require('koa-router')
const _ = require('lodash')
const { sendFirstMessage, sendFirstMessageHighValue, createLead } = require('../usecases/sirena')
const ac = require('../usecases/active-campaign')

const router = new Router({
  prefix: '/sirena'
})

router.post('/lead', async ctx => {
  const {
    firstName,
    lastName,
    email,
    phone,
    id,
    source,
    campaignName,
    comments
  } = ctx.request.body

  if (!firstName) throw ctx.throw(400, 'firstName is required')
  if (!lastName) throw ctx.throw(400, 'lastName is required')
  if (!id) throw ctx.throw(400, 'contact id is required')
  if (!email) throw ctx.throw(400, 'email is required')
  if (!phone) throw ctx.throw(400, 'phone is required')

  const leadData = await createLead(firstName, lastName, phone, email, source, campaignName, comments)
  const prospectId = _.get(leadData, 'id')

  ctx.resolve({
    message: 'Lead created',
    payload: {
      prospectId
    }
  })
})

router.post('/messages/first', async ctx => {
  const {
    firstName,
    lastName,
    email,
    phone,
    id,
    source,
    campaignName,
    comments
  } = ctx.request.body

  if (!firstName) throw ctx.throw(400, 'firstName is required')
  if (!lastName) throw ctx.throw(400, 'lastName is required')
  if (!id) throw ctx.throw(400, 'contact id is required')
  if (!email) throw ctx.throw(400, 'email is required')
  if (!phone) throw ctx.throw(400, 'phone is required')

  await sendFirstMessage(firstName, lastName, phone, email, source, campaignName, comments)
  await ac.deals.updateDealStage(id)

  ctx.resolve({
    message: 'Message sent and deal stage updated'
  })
})

router.post('/messages/high-value/first', async ctx => {
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

  await sendFirstMessageHighValue(firstName, lastName, phone, email, source, campaignName)

  ctx.resolve({
    message: 'Message sent'
  })
})

module.exports = router
