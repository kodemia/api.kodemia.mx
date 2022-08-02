const createError = require('http-errors')
const _ = require('lodash')
const sirena = require('../lib/sirena')

async function createLead (firstName, lastName, phone, email, source, campaignName, comments = 'no comments') {
  const utmSource = campaignName || source || 'Desconocido'
  const phones = [phone]
  const emails = [email]
  const body = {
    firstName,
    lastName,
    phones,
    emails,
    utmSource,
    comments
  }
  const lead = await sirena.fetch('POST', '/lead/retail', body)

  return lead
}

async function sendFirstMessage (firstName, lastName, phone, email, source, campaignName, comments) {
  const leadData = await createLead(firstName, lastName, phone, email, source, campaignName, comments)
  const prospectId = _.get(leadData, 'id')
  const data = {
    key: sirena.constants.templates.firstMessage.id,
    parameters: {
      'prospect.firstName': firstName
    }
  }
  try {
    await sirena.fetch('POST', `prospect/${prospectId}/messaging/whatsapp/notification`, data)
  } catch (error) {
    if (error.status === 403 && error.message.includes('WITHOUT_PHONE')) {
      throw createError(412, '[Sirena] Invalid phone or not a WhatsApp account')
    }
    throw createError(error.status, `[Sirena] ${error.message}`)
  }
}

async function sendFirstMessageHighValue (firstName, lastName, phone, email, source, campaignName) {
  const leadData = await createLead(firstName, lastName, phone, email, source, campaignName)
  const prospectId = _.get(leadData, 'id')
  const data = {
    key: sirena.constants.templates.firstMessageHighValue.id,
    parameters: {
      'prospect.firstName': firstName
    }
  }
  try {
    await sirena.fetch('POST', `prospect/${prospectId}/messaging/whatsapp/notification`, data)
  } catch (error) {
    if (error.status === 403 && error.message.includes('WITHOUT_PHONE')) {
      throw createError(412, '[Sirena] Invalid phone or not a WhatsApp account')
    }
    throw createError(error.status, `[Sirena] ${error.message}`)
  }
}

module.exports = {
  sendFirstMessage,
  sendFirstMessageHighValue
}
