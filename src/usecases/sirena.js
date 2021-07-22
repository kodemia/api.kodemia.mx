const createError = require('http-errors')
const _ = require('lodash')
const sirena = require('../lib/sirena')

async function getProspect(email) {
  const prospect = await sirena.fetch('GET', '/prospects', null, { search: email })
  const prospectData = _.head(prospect)

  if (!prospectData) throw createError(404, 'Prospect not found')

  return prospectData
}

async function sendFirstMessage(email) {
  const prospect = await getProspect(email)
  const data = {
    'key': sirena.constants.templates.firstMessage.id,
    'parameters': {
      'prospect.firstName': prospect.firstName,
      'group.displayName': sirena.constants.account.name,
      'user.firstName': sirena.constants.agent.firstName
    }
  }
  const response = await sirena.fetch('POST', `prospect/${prospect.id}/messaging/whatsapp/notification`, data)

  return response
}

module.exports = {
  sendFirstMessage
}
