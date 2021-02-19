const Router = require('koa-router')

const ac = require('../../usecases/active-campaign')

const router = new Router({
  prefix: '/apply'
})

router.post('/', async ctx => {
  const {
    email,
    firstName,
    lastName,
    phone,
    course,
    customFields = { source: '', reasonToApply: '', campaignName: '' },
    tags = ['website']
  } = ctx.request.body

  const contact = await ac.contacts.upsert(email, firstName, lastName, phone, customFields)

  const dealInList = await ac.lists.subscribeContact(contact.id, course)

  const addTagsPromises = tags
    .map((tagName) => ac.contacts.addTag(contact.id, tagName))

  await Promise.all(addTagsPromises)

  ctx.resolve({
    message: 'Contact created and associated',
    payload: {
      contact,
      dealInList
    }
  })
})

module.exports = router
