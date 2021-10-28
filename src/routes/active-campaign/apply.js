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
    customFields = {
      source: '',
      reasonToApply: '',
      campaignName: 'website',
      knowledge: '',
      reasonToProgramming: ''
    },
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
    course,
    customFields = {
      source: '',
      cvUrl: '',
      reasonToApplyForScholarship: '',
      campaignName: 'website mobile'
    },
    tags = ['mobile']
  } = ctx.request.body

  if (!customFields.reasonToApplyForScholarship) throw ctx.throw(400, 'Reasion to apply for a scholarship is required')
  if (!customFields.campaignName) throw ctx.throw(400, 'campaign name is required')
  if (!course) throw ctx.throw(400, 'Course is required')

  customFields.program = course

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
