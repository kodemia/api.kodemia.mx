const assert = require('http-assert')
const _ = require('lodash')

const ac = require('../../lib/active-campaign')

async function subscribeContact (contactId, course) {
  assert(contactId, 400, 'contactId is required')
  assert(course, 400, 'course is required')

  course = course.toLowerCase()

  const defaultJSList = 'default'
  const defaultPythonList = 'default'
  const finalGeneration = course.toLowerCase().includes('python')
    ? defaultPythonList
    : defaultJSList

  const defaultListId = ac.constants.lists['javascript-live'].default.id

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

async function subscribeContactByListName (contactId, listName) {
  assert(contactId, 400, 'contactId is required')
  assert(listName, 400, 'listName is required')

  listName = listName.toLowerCase()

  const list = _.get(ac, `constants.lists.${listName}.id`)

  assert(list, 404, `List [${listName}] not found`)

  const subscribeResponse = await ac.fetch('POST', '/contactLists', {
    contactList: {
      list,
      contact: contactId,
      status: '1'
    }
  })

  return _.get(subscribeResponse, 'contactList', null)
}

async function subscribeCompanyContact (contactId) {
  assert(contactId, 400, 'contactId is required')

  const list = _.get(ac, 'constants.lists.empresas.id')

  const subscribeCompanyResponse = await ac.fetch('POST', '/contactLists', {
    contactList: {
      list,
      contact: contactId,
      status: '1'
    }
  })

  return _.get(subscribeCompanyResponse, 'contactList', null)
}

module.exports = {
  subscribeContact,
  subscribeCompanyContact,
  subscribeContactByListName
}
