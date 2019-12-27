require('dotenv').config()

const db = require('../../src/lib/db')
const Class = require('../../src/usecases/class')
const classesList = require('../bulk/classes-to-upload')

async function main () {
  await db.connect()
  const createdClassesPromises = classesList.map(classData => Class.create(classData))
  return Promise.all(createdClassesPromises)
}

main()
  .then((classes) => {
    console.log('Clases: ', classes)
    console.log('DONE!!')
    process.exit(0)
  })
  .catch(error => {
    console.log('ERROR: ', error)
    process.exit(1)
  })
