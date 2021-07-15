
const sirena = require('../lib/sirena')

async function getProspectId (email) {
  const prospect = await sirena.fetch('GET', '/prospects', null, { search: email })
  console.log(prospect)
}

module.exports = {
  getProspectId
}
