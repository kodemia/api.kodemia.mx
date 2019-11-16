const createError = require('http-errors')
const assert = require('http-assert')
const _ = require('lodash')

const Class = require('../models/class').model
const Generation = require('../models/generation').model
const Mentor = require('../models/mentor').model

async function create ({ title, date, description, thumbnail, playbackId, mentor, generation = {} }) {
  const generationFound = await Generation.findOne({ type: generation.type, number: generation.number }).exec()
  if (!generationFound) throw createError(409, `Generation [${generation.type}, ${generation.number}] does not exists`)

  const mentorFound = await Mentor.findOne({ ...mentor })
  if (!mentorFound) throw createError(409, `Mentor [${mentor}] does not exists`)

  const existingClass = await Class.findOne({ playbackId })
  if (existingClass) throw createError(409, `Class with [${playbackId}] already exists`)

  const newClass = new Class({
    title,
    date: new Date(date),
    description,
    thumbnail,
    playbackId,
    mentor: mentorFound._id,
    generation: generationFound._id
  })

  const error = newClass.validateSync()
  if (error) throw error

  const savedClass = await newClass.save()
  return {
    ...savedClass.toObject({ getters: true }),
    mentor: _.omit(mentorFound.toObject({ getters: true }), 'password')
  }
}

async function getAll (selectOptions = '') {
  return Class.find({})
    .sort({ date: 'desc' })
    .populate({
      path: 'mentor generation',
      select: selectOptions
    })
}

async function getListByUser (user = {}) {
  const { isMentor, generation } = user
  assert(!isMentor && generation, 404, 'User has no generation associated')
  if (isMentor) return this.getAll('-password')

  return Class.find({ generation })
    .sort({ date: 'desc' })
    .populate({
      path: 'mentor generation',
      select: '-password'
    })
}

module.exports = {
  create,
  getAll,
  getListByUser
}
