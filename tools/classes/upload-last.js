
require('dotenv').config()
require('colors')

const { program } = require('commander')
const isEmpty = require('lodash/isEmpty')

program
  .option('--use-secondary', 'To use secondary vimeo account')
  .option('--slack-output', 'To format output to be send to slack')

program.parse(process.argv)

const options = program.opts()
if (options.useSecondary) {
  process.env.VIMEO_TOKEN = process.env.VIMEO_TOKEN_SECONDARY
}

const db = require('../../src/lib/db')
const klass = require('../../src/usecases/class')

function logger () {
  if (options.slackOutput) return () => {}
  return console.log
}

async function main () {
  const vimeoAccountName = options.useSecondary ? 'SECONDARY' : 'PRIMARY'
  logger(`➤ ${vimeoAccountName} VIMEO UPLOAD LAST`.bgBlue.white)
  logger('➤ Connecting DB'.blue)
  await db.connect({ logSuccess: !options.slackOutput })

  logger('➤ Connecting to Vimeo'.blue)
  const uploadedClasses = await klass.uploadLastClasses()
  logger('✔ Classes upload finished'.green)

  // TODO: build return the json for the slack block
  return {
    uploadedClasses,
    vimeoAccountName
  }
}

main()
  .then(classes => {
    if (isEmpty(classes)) {
      logger('🤷 No classes to upload'.yellow)
      process.exit(0)
    }

    logger(`✔ ${classes.length} Classes uploaded`.green)

    if (!options.slackOutput) {
      classes.map(klass => console.table(klass))
    }

    process.exit(0)
  })
  .catch(error => {
    console.error('✖ An error ocurred'.red)
    console.error('ERROR:', error)
    process.exit(1)
  })
