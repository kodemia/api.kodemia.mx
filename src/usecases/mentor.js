const createError = require('http-errors')

const bcrypt = require('../lib/bcrypt')

const Mentor = require('../models/mentor').model

async function create ({ firstName, lastName, email, password, phone }) {
  const hash = await bcrypt.create(password)

  const existingMentor = await Mentor.findOne({ email })
  if (existingMentor) throw createError(409, `Mentor [${email}] already exists`)

  const newMentor = new Mentor({ firstName, lastName, email, password: hash, phone })
  const error = newMentor.validateSync()
  if (error) throw error

  return newMentor.save()
}

function getAll (selectOptions = '') {
  return Mentor.find({}).select(selectOptions)
}

function getById (id, selectOptions) {
  return Mentor.findById(id).select(selectOptions)
}

module.exports = {
  getById,
  getAll,
  create
}
