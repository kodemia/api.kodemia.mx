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
    course = 'javascript-live',
    customFields = { source: '', reasonToApply: '', campaignName: '', knowledge: '', reasonToProgramming: '' },
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

router.post('/mobile', async ctx => {
  const {
    firstName,
    lastName,
    email,
    phone,
    course = 'temporaryBackbase', // ToDo: poner la lista correcta
    customFields = {
      source: '', cvUrl: ''
    },
    tags = ['landing']
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
