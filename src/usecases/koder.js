const bcrypt = require('../lib/bcrypt')
const Koder = require('../models/koder').model
const Generation = require('../models/generation').model
const createError = require('http-errors')

const create = async ({ firstName = '', lastName = '', email = '', password = '', phone = '', generation = {} }) => {
  const hash = await bcrypt.create(password)

  const generationFound = await Generation.findOne({ type: generation.type, number: generation.number })
  if (!generationFound) throw createError(409, `Generation [${generation.type}, ${generation.number}] does not exists`)

  const newKoder = new Koder({ firstName, lastName, email, password: hash, phone, generation: generationFound._id })

  const error = newKoder.validateSync()
  if (error) throw error

  const existingKoder = await Koder.findOne({ email }).exec()
  if (existingKoder) throw createError(409, `Koder [${email}] already exists`)

  return newKoder.save()
}

const resetPassword = async (email = '', password = '') => {
  const hash = await bcrypt.create(password)
  const koder = await Koder.findOne({ email })
  if (!koder) throw createError(404, `Koder [${email}] does not exists`)

  koder.password = hash

  return koder.save()
}

const getAll = async () => Koder.find({}).sort({ email: 'asc' }).populate('generation').exec()

const sigIn = async (email = '', password = '') => {
  const koder = await Koder.findOne({ email }).exec()

  if (!koder) throw createError(401, 'Invalid data')

  const { password: hash } = koder
  const isValidPassword = await bcrypt.verify(password, hash)
  if (!isValidPassword) throw createError(401, 'Invalid data')
  return koder
}

function getById (id) {
  return Koder.findById(id).exec()
}

module.exports = {
  create,
  getAll,
  sigIn,
  resetPassword,
  getById
}
