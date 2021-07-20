
const sirena = require('../lib/sirena')

async function getProspect(email) {
  const prospect = await sirena.fetch('GET', '/prospects', null, { search: email })
  return prospect[0]
}

async function sendTemplate(email) {
  const prospectData = await getProspect(email)
  // let { id, firstName } = prospectData
  const data = {
    'key': '6c1c93ac-1299-467c-afaa-1606c99799f2',
    'parameters': {
      'prospect.firstName': 'Naomi',
      'group.displayName': 'Kodemia',
      'user.firstName': 'Gabs'
    }
  }
  const response = await sirena.fetch('POST', 'prospect/60ad5e96ffcb3f000877e3f3/messaging/whatsapp/notification', data)
  console.log('send', response, prospectData)
  // return response
}

module.exports = {
  sendTemplate
}
