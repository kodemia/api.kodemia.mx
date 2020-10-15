
require('dotenv').config()

const path = require('path')
const _ = require('lodash')
const fs = require('fs-extra')
const args = require('minimist')(process.argv.splice(2))
const parse = require('csv-parse/lib/sync')

const db = require('../../src/lib/db')

const generation = require('../../src/usecases/generation')
const koder = require('../../src/usecases/koder')

async function main () {
  const {
    csv = '',
    generationNumber = 0,
    generationType = 'white'
  } = args

  if (!csv) throw new Error('csv file is required')
  if (!csv.endsWith('.csv')) throw new Error('File must be a csv file')
  const csvPath = path.join(process.cwd(), csv)
  if (!fs.pathExistsSync(csv)) throw new Error(`File path "${csvPath}" does not exists`)

  if (!generationNumber) throw new Error('Generation number must be specified')
  if (!generationType) throw new Error('Generation type must be specified')

  const csvData = fs.readFileSync(csvPath)

  const koders = parse(csvData, {
    columns: true,
    skip_empty_lines: true
  })

  const kodersData = koders.map(oneKoder => {
    const [password] = _.get(oneKoder, 'email', '').trim().split('@')
    const phone = _.get(oneKoder, 'phone', '').replace(/\s/g, '')
    return {
      ...oneKoder,
      password,
      phone,
      generation: {
        number: generationNumber,
        type: generationType
      }
    }
  })

  await db.connect()
  console.log('> DB connected')
  await generation.createIfNotExists({ number: generationNumber, type: generationType })
  return koder.upsertMany(kodersData)
}

main()
  .then(koders => {
    console.log('Koders: ', koders)
    process.exit(0)
  })
  .catch(error => {
    console.error('Error: ', error)
    process.exit(1)
  })
