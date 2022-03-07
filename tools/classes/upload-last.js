
require('dotenv').config()
require('colors')

const { program } = require('commander')
const isEmpty = require('lodash/isEmpty')

program
  .option('--use-secondary', 'To use secondary vimeo account')

program.parse(process.argv)

const options = program.opts()
if (options.useSecondary) {
  process.env.VIMEO_TOKEN = process.env.VIMEO_TOKEN_SECONDARY
}

const db = require('../../src/lib/db')
const klass = require('../../src/usecases/class')

async function main () {
  const vimeoAccountName = options.useSecondary ? 'SECONDARY' : 'PRIMARY'

  console.log('ENV VIMEO (' + vimeoAccountName + '): ', process.env.VIMEO_TOKEN)

  console.info(`➤ ${vimeoAccountName} VIMEO UPLOAD LAST`.bgBlue.white)
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

    console.log(`✔ ${classes.length} Classes uploaded`.green)
    classes.map(klass => console.table(klass))
    process.exit(0)
  })
  .catch(error => {
    console.error('✖ An error ocurred'.red)
    console.error('ERROR:', error)
    process.exit(1)
  })
