
require('dotenv').config()

const assert = require('assert')
const args = require('minimist')(process.argv.splice(2))

const db = require('../src/lib/db')

const mentor = require('../src/usecases/mentor')

async function main () {
  const {
    email,
    newPassword
  } = args

  assert(email, '--email param is required')
  assert(email, '--mewPassword param is required')

  await db.connect()
  console.log('> DB connected')
  return mentor.resetPassword(email, newPassword)
}

main()
  .then(koders => {
    console.log('Password updated')
    console.log('Mentor: ', koders)
    process.exit(0)
  })
  .catch(error => {
    console.error('Error: ', error)
    process.exit(1)
  })
