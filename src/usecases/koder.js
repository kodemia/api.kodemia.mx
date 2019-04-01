const bcrypt = require('../lib/bcrypt')
const Koder = require('../models/koder').model
const createError = require('http-errors')

const create = async ({ firstName = '', lastName = '', email = '', password = '' }) => {
  const hash = await bcrypt.create(password)
  const newKoder = new Koder({ firstName, lastName, email, password: hash })

  const error = newKoder.validateSync()
  if (error) throw error

  const existingKoder = await Koder.findOne({ email }).exec()
  if (existingKoder) throw createError(409, `Koder [${email}] already exists`)

  return newKoder.save()
}

const getAll = () => Koder.find({}).exec()

const sigIn = async (email = '', password = '') => {
  const koder = await Koder.findOne({ email }).exec()

  if (!koder) throw createError(401, 'Invalid data')

  const { password: hash } = koder
  const isValidPassword = await bcrypt.verify(password, hash)
  if (!isValidPassword) throw createError(401, 'Invalid data')
  return koder
}

module.exports = {
  create,
  getAll,
  sigIn
}
