
const assert = require('http-assert')
const _ = require('lodash')

const ac = require('../../lib/active-campaign')

async function upsert (email, firstName, lastName, phone) {
  assert(email, 400, 'email is required')
  assert(firstName, 400, 'firstName is required')
  assert(phone, 400, 'phone is required')

  const contact = {
    email,
    firstName,
    lastName,
    phone
  }

  const newContactResponse = await ac.fetch('POST', '/contact/sync', { contact })
  return _.get(newContactResponse, 'contact', null)
}

module.exports = {
  upsert
}
