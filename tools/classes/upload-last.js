
require('dotenv').config()
const isEmpty = require('lodash/isEmpty')

const db = require('../../src/lib/db')
const Class = require('../../src/usecases/class')

async function main () {
  await db.connect()
  return Class.uploadLastClasses()
}

main()
  .then(classes => {
    if (isEmpty(classes)) {
      console.info('🤷 No classes to upload')
      process.exit(0)
    }

    classes.map(console.table)
    console.log('✅ Classes uploaded: ', classes.length)
    process.exit(0)
  })
  .catch(error => {
    console.log('ERROR:', error)
    process.exit(1)
  })
