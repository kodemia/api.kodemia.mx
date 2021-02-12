const Router = require('koa-router')
const ac = require('../../usecases/active-campaign')

const router = new Router(
  {
    prefix: '/companies'
  }
)

router.post('/', async (ctx) => {
  const {
    email,
    firstName,
    lastName,
    phone,
    customFields = { company: '', position: '' }
  } = ctx.request.body

  const contact = await ac.contacts.upsert(email, firstName, lastName, phone, customFields)
  const companyInList = await ac.lists.subscribeCompanyContact(contact.id)

  ctx.resolve(
    {
      message: 'Contact created and asociated',
      payload: { contact, companyInList }
    }
  )
})

module.exports = router
