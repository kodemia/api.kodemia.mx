const Router = require('koa-router')

const ac = require('../../usecases/active-campaign')

const router = new Router({
  prefix: '/apply'
})

router.post('/', async ctx => {
  const { email, firstName, lastName, phone, course } = ctx.request.body

  const contact = await ac.contacts.upsert(email, firstName, lastName, phone)

  const dealInList = await ac.lists.subscribeContact(contact.id, course)

  ctx.resolve({
    message: 'Contact created and associated',
    payload: {
      contact,
      dealInList
    }
  })
})

module.exports = router
