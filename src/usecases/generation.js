
const createError = require('http-errors')

const Generation = require('../models/generation').model

async function create ({ number, type, startDate, endDate }) {
  const newGeneration = new Generation({ number, type, startDate, endDate })
  const error = newGeneration.validateSync()
  if (error) throw error

  const existingGeneration = await Generation.findOne({ number, type }).exec()
  if (existingGeneration) throw createError(409, `Generation [${number}, ${type}] already exists`)

  return newGeneration.save()
}

async function createIfNotExists ({ number, type, startDate, endDate }) {
  const generationFound = await Generation.findOne({ type, number })
  if (generationFound) return generationFound

  const newGeneration = new Generation({ number, type, startDate, endDate })
  const error = newGeneration.validateSync()
  if (error) throw error

  return newGeneration.save()
}

async function getAll () {
  return Generation.find({}).exec()
}

module.exports = {
  create,
  createIfNotExists,
  getAll
}
