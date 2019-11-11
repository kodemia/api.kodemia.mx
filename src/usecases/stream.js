const createError = require('http-errors')
const _ = require('lodash')

const Stream = require('../models/stream').model
const Generation = require('../models/generation').model

async function create ({ name, generation, title, url, muxData, endDate, isActive, isLive }) {
  const generationFound = await Generation.findOne({ type: generation.type, number: generation.number }).exec()
  if (!generationFound) throw createError(409, `Generation [${generation.type}, ${generation.number}] does not exists`)

  const newStream = new Stream({ name, generation: generationFound._id, title, url, muxData, endDate, isActive, isLive })
  const error = newStream.validateSync()
  if (error) throw error

  const existingStream = await Stream.findOne({ name }).exec()
  if (existingStream) throw createError(409, `Stream [${name}] already exists`)

  return newStream.save()
}

async function getAll () {
  return Stream.find({}).exec()
}

async function getByGenerationId (generationId) {
  const stream = await Stream.findOne({ generation: generationId }).populate('generation').lean()
  const playbackId = _.get(stream, 'muxData.playback_ids.0.id', '')
  const {
    muxData,
    ...restStream
  } = stream
  return { playbackId, ...restStream }
}

module.exports = {
  getAll,
  create,
  getByGenerationId
}
