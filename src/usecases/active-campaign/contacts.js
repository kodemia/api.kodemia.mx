const assert = require('http-assert')
const _ = require('lodash')

const ac = require('../../lib/active-campaign')

async function upsert (email, firstName, lastName, phone, customFields = {}) {
  assert(email, 400, 'email is required')
  assert(firstName, 400, 'firstName is required')
  assert(lastName, 400, 'LastName is required')

  let fieldValues = ac.utils.buildFieldValuesArrayFromObject(customFields)

  const contact = {
    email,
    firstName,
    lastName,
    phone,
    fieldValues
  }

  const newContactResponse = await ac.fetch('POST', '/contact/sync', { contact })

  return _.get(newContactResponse, 'contact', null)
}

async function addTag (contactId, tagName) {
  return ac.fetch('POST', '/contactTags', {
    contactTag: {
      contact: contactId,
      tag: ac.constants.tags['tagName'].id
    }
  })
}

module.exports = {
  upsert,
  addTag
}
