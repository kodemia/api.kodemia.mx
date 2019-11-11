const createError = require('http-errors')
const assert = require('http-assert')

const Class = require('../models/class').model
const Generation = require('../models/generation').model
const Mentor = require('../models/mentor').model

async function create ({ title, date, description, thumbnail, playbackId, mentor, generation = {} }) {
  const generationFound = await Generation.findOne({ type: generation.type, number: generation.number }).exec()
  if (!generationFound) throw createError(409, `Generation [${generation.type}, ${generation.number}] does not exists`)

  const mentorFound = await Mentor.findOne({ ...mentor }).exec()
  if (!mentorFound) throw createError(409, `Mentor [${mentor}] does not exists`)

  const existingClass = await Class.findOne({ playbackId }).exec()
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

  return newClass.save()
}

async function getAll () {
  const classes = await Class.find({}).sort({ date: 'desc' }).populate('mentor generation').exec()

  return classes.map(klass => {
    const objKlass = klass.toObject({ getters: true })
    const { mentor } = klass
    const { password, ...cleanMentor } = mentor.toObject({ getters: true })
    return {
      ...objKlass,
      mentor: cleanMentor
    }
  })
}

async function getList (user = {}) {
  const { isMentor, generation } = user
  assert(!isMentor && generation, 404, 'User has no generation associated')
  if (isMentor) return this.getAll()

  const classes = await Class.find({ generation }).sort({ date: 'desc' }).populate('mentor generation').exec()

  return classes.map(klass => {
    const objKlass = klass.toObject({ getters: true })
    const { mentor } = klass
    const { password, ...cleanMentor } = mentor.toObject({ getters: true })
    return {
      ...objKlass,
      mentor: cleanMentor
    }
  })
}

module.exports = {
  create,
  getAll,
  getList
}
