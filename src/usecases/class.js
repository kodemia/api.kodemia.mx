const createError = require('http-errors')
const _ = require('lodash')
const fetch = require('node-fetch')

const utils = require('../lib/utils')

const Class = require('../models/class').model
const Generation = require('../models/generation').model
const Mentor = require('../models/mentor').model

async function vimeoVideoFetchById (vimeoId) {
  return fetch(`https://api.vimeo.com/videos/${vimeoId}`, {
    headers: {
      Authorization: `Bearer ${process.env.VIMEO_TOKEN}`
    }
  })
}

async function getVimeoVideoData (vimeoId) {
  const videoDataResponse = await vimeoVideoFetchById(vimeoId)
  if (!videoDataResponse.ok) throw createError(404, `Class ${vimeoId} not found in vimeo`)
  let videoData = await videoDataResponse.json()

  let picture = _.get(videoData, 'pictures', [])
  const pictureSizes = _.get(picture, 'sizes', [])
  picture = pictureSizes.find(picture => picture.width === 640)
  const thumbnail = _.get(picture, 'link', '')

  const {
    description = '',
    name: title = '',
    created_time: date
  } = videoData

  return {
    title,
    description,
    date,
    thumbnail
  }
}

async function create (classData) {
  const {
    title,
    date,
    description,
    thumbnail,
    playbackId,
    mentor,
    generation = {},
    vimeoId
  } = classData

  const generationFound = await Generation.findOne({
    type: generation.type,
    number: generation.number
  })
  if (!generationFound) createError(409, `Generation [${generation.type}, ${generation.number}] does not exists`)

  const mentorFound = await Mentor.findOne({ ...mentor })
  if (!mentorFound) createError(409, `Mentor [${mentor}] does not exists`)

  const existingClass = await Class.findOne({ vimeoId })
  if (existingClass) throw createError(409, `Class with vimeoId [${vimeoId}] already exists`)

  let vimeoData = await getVimeoVideoData(vimeoId)
  vimeoData = utils.removeFalsyEntries(vimeoData)

  let newClassData = {
    title,
    date,
    description,
    thumbnail,
    playbackId,
    mentor: mentorFound._id,
    generation: generationFound._id,
    vimeoId
  }
  newClassData = utils.removeFalsyEntries(newClassData)

  const newClass = new Class({ ...vimeoData, ...newClassData })

  const error = newClass.validateSync()
  if (error) throw error

  const savedClass = await newClass.save()
  return Class.findById(savedClass._id)
    .populate('mentor generation')
    .lean()
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
  if (isMentor) return this.getAll()

  return Class.find({ generation })
    .sort({ date: 'desc' })
    .populate('mentor generation')
}

module.exports = {
  create,
  getAll,
  getListByUser
}
