const Router = require('koa-router')

const ac = require('../../usecases/active-campaign')

const router = new Router({
  prefix: '/contacts'
})

router.post('/skillup', async ctx => {
  const { email, firstName, lastName, phone, curso } = ctx.request.body

  const contact = await ac.contacts.upsert(email, firstName, lastName, phone)
  const deal = await ac.deals.create(
    `${contact.firstName} [${curso}]`,
    contact.id,
    0
  )
  await ac.deals.setCustomProperty(deal.id, 'curso', curso)

  ctx.resolve({
    message: 'Contact and deal created',
    payload: {
      contact,
      deal
    }
  })
})

module.exports = router
