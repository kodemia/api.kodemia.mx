const createError = require('http-errors')
const _ = require('lodash')
const sirena = require('../lib/sirena')

async function getProspect (email) {
  const prospect = await sirena.fetch('GET', '/prospects', null, { search: email })
  const prospectData = _.head(prospect)

  if (!prospectData) throw createError(404, '[Sirena] Prospect not found')

  return prospectData
}

async function sendFirstMessage (email) {
  const prospect = await getProspect(email)
  const data = {
    'key': sirena.constants.templates.firstMessage.id,
    'parameters': {
      'prospect.firstName': prospect.firstName
    }
  }
  try {
    await sirena.fetch('POST', `prospect/${prospect.id}/messaging/whatsapp/notification`, data)
  } catch (error) {
    if (error.status === 403 && error.message.includes('WITHOUT_PHONE')) {
      throw createError(412, '[Sirena] Invalid phone or not a WhatsApp account')
    }
    throw createError(error.status, `[Sirena] ${error.message}`)
  }
}

module.exports = {
  sendFirstMessage
}
