const assert = require('http-assert')
const _ = require('lodash')
const ac = require('../../lib/active-campaign')

async function create(title, contactId, value, owner, description, pipeline) {
  assert(contactId, 400, 'contactId is required')
  assert(title, 400, 'title is required')

  const dealProperties = {
    contact: contactId,
    description: description,
    currency: 'mxn',
    group: pipeline || ac.constants.pipelines.bwj10_bwp1.id,
    status: 0,
    title: title,
    value: value || 0,
    owner: owner || ac.constants.users.diana.id
  }

  const dealResponse = await ac.fetch('POST', '/deals', {
    deal: dealProperties
  })
  return _.get(dealResponse, 'deal', null)
}

async function getDealIdByContactId(contactId) {
  const dealResponse = await ac.fetch('GET', '/deals', null, { contact: contactId }, null)
  return _.get(dealResponse, 'deals[0].id', null)
}

async function updateDealStage(contactId) {
  const dealId = await getDealIdByContactId(contactId)
  assert(dealId, 404, 'deal id not found')

  const dealResponse = await ac.fetch('PUT', `/deals/${dealId}`, {
    deal: {
      stage: ac.constants.stages['primer-contacto'].id
    }
  })
  return _.get(dealResponse, 'deal', null)
}

async function setCustomProperty(dealId, propertyName, value) {
  const dealResponse = await ac.fetch('POST', '/dealCustomFieldData', {
    dealCustomFieldDatum: {
      dealId: dealId,
      customFieldId: ac.constants.deals.customProperties[propertyName].id,
      fieldValue: value
    }
  })

  return _.get(dealResponse, 'deal', null)
}

module.exports = {
  create,
  setCustomProperty,
  updateDealStage
}
