
const sirena = require('../lib/sirena')


async function getProspect(email) {
  const prospect = await sirena.fetch('GET', '/prospects', null, { search: email })
  return prospect[0]
}

async function sendTemplate(email) {
  const prospect = await getProspect(email)
  const data = {
    'key': sirena.constants.templates.firstMessage,
    'parameters': {
      'prospect.firstName': prospect.firstName,
      'group.displayName': 'Kodemia',
      'user.firstName': sirena.constants.agent.firstName
    }
  }
  const response = await sirena.fetch('POST', `prospect/${prospect.id}/messaging/whatsapp/notification`, data)

  return response
}

module.exports = {
  sendTemplate
}
