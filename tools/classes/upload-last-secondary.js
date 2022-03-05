
require('dotenv').config()
require('colors')

const isEmpty = require('lodash/isEmpty')

process.env.VIMEO_TOKEN = process.env.VIMEO_TOKEN_SECONDARY

const db = require('../../src/lib/db')
const klass = require('../../src/usecases/class')

async function main () {
  console.info('➤ SECONDARY VIMEO UPLOAD LAST'.bgBlue.white)
  console.info('➤ Connecting DB'.blue)
  await db.connect()

  console.info('➤ Connecting to Vimeo'.blue)
  const uploadedClasses = await klass.uploadLastClasses()
  console.info('✔ Classes upload finished'.green)

  return uploadedClasses
}

main()
  .then(classes => {
    if (isEmpty(classes)) {
      console.info('🤷 No classes to upload'.yellow)
      process.exit(0)
    }

    classes.map(klass => console.table(klass))
    console.log(`✔ ${classes.length} Classes uploaded`.green)
    process.exit(0)
  })
  .catch(error => {
    console.error('✖ An error ocurred'.red)
    console.error('ERROR:', error)
    process.exit(1)
  })
