const createError = require('http-errors')

const bcrypt = require('../lib/bcrypt')

const Mentor = require('../models/mentor').model

async function create ({ firstName, lastName, email, password, phone }) {
  const hash = await bcrypt.hash(password)

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

async function resetPassword (email = '', newPassword = '') {
  const hash = await bcrypt.hash(newPassword)
  const mentor = await Mentor.findOne({ email }).select('+password')
  if (!mentor) throw createError(404, `Mentor [${email}] does not exists`)

  mentor.password = hash
  const updatedMentor = await mentor.save()
  return updatedMentor.toPublic()
}

module.exports = {
  getById,
  getAll,
  create,
  resetPassword
}
