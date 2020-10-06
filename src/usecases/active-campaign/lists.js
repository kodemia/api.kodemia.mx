const assert = require('http-assert')
const _ = require('lodash')

const ac = require('../../lib/active-campaign')

async function subscribeContact (contactId, course) {
  assert(contactId, 400, 'contactId is required')
  assert(course, 400, 'course is required')

  course = course.toLowerCase()

  const currentJSGeneration = 'ten'
  const currentPythonGeneration = 'one'
  const finalGeneration = course.toLowerCase().includes('python')
    ? currentPythonGeneration
    : currentJSGeneration

  const defaultListId = '14'

  const list = _.get(ac, `constants.lists.${course}.${finalGeneration}.id`, defaultListId)

  const subscribeDealResponse = await ac.fetch('POST', '/contactLists', {
    contactList: {
      list,
      contact: contactId,
      status: '1'
    }
  })

  return _.get(subscribeDealResponse, 'contactList', null)
}

module.exports = {
  subscribeContact
}
