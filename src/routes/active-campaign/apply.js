const Router = require('koa-router')

const ac = require('../../usecases/active-campaign')

const router = new Router({
  prefix: '/apply'
})

router.post('/', async ctx => {
  const { email, firstName, lastName, phone, course } = ctx.request.body

  const contact = await ac.contacts.upsert(email, firstName, lastName, phone)

  const dealInList = await ac.lists.subscribeDeal(course, contact.id)

  ctx.resolve({
    message: 'Contact and deal created',
    payload: {
      contact,
      dealInList
    }
  })
})

module.exports = router
