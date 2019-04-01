const createError = require('http-errors')

const Mentor = require('../models/mentor').model

const create = async ({ firstName, lastName, email, password, phone }) => {
  const newMentor = new Mentor({ firstName, lastName, email, password, phone })
  const error = newMentor.validateSync()
  if (error) throw error

  const existingMentor = await Mentor.findOne({ email }).exec()
  if (existingMentor) throw createError(409, `Mentor [${email}] already exists`)

  return newMentor.save()
}

const getAll = () => Mentor.find({}).exec()

module.exports = {
  getAll,
  create
}
