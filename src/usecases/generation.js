
const createError = require('http-errors')
const Generation = require('../models/generation').model

const create = async ({ number, type, startDate, endDate }) => {
  const newGeneration = new Generation({ number, type, startDate, endDate })
  const error = newGeneration.validateSync()
  if (error) throw error

  const existingGeneration = await Generation.findOne({ number, type }).exec()
  if (existingGeneration) throw createError(409, `Generation [${number}, ${type}] already exists`)

  return newGeneration.save()
}

const getAll = async () => Generation.find({}).exec()

module.exports = {
  create,
  getAll
}
