const Router = require('koa-router')

const ac = require('../../usecases/active-campaign')
const acData = require('../../lib/active-campaign')

const router = new Router({
  prefix: '/apply'
})

router.post('/', async ctx => {
  const { email, firstName, lastName, phone, course } = ctx.request.body

  const bootcampDealValue = 0
  const dealDescription = 'website'
  const contact = await ac.contacts.upsert(email, firstName, lastName, phone)
  const deal = await ac.deals.create(
    `${contact.firstName} [${course}]`,
    contact.id,
    bootcampDealValue,
    acData.constants.users.veronica.id,
    dealDescription,
    acData.constants.pipelines.bwj10_bwp1.id
  )

  await ac.deals.setCustomProperty(deal.id, 'curso', course)
  ctx.resolve({
    message: 'Contact and deal created',
    payload: {
      contact,
      deal
    }
  })
})

module.exports = router
