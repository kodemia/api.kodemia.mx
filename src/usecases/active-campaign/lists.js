const assert = require('http-assert')
const _ = require('lodash')

const ac = require('../../lib/active-campaign')

async function subscribeDeal (course, contactId) {
  assert(contactId, 400, 'contactId is required')
  assert(course, 400, 'course is required')

  let list = ''
  if (course === 'javascript-lifetime') {
    list = ac.constants.lists.bwj10.id
  } else if (course === 'javascript-live') {
    list = ac.constants.lists.bwjl10.id
  } else if (course === 'python-live') {
    list = ac.constants.lists.bwpl1.id
  } else if (course === 'python-lifetime') {
    list = ac.constants.lists.bwp1.id
  }

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
  subscribeDeal
}
