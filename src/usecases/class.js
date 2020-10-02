
const createError = require('http-errors')
const _ = require('lodash')
const utils = require('../lib/utils')
const dayjs = require('dayjs')

const Class = require('../models/class').model
const Mentor = require('../models/mentor').model
const Generation = require('../models/generation').model

const vimeo = require('../lib/vimeo')

async function getVimeoVideoData (vimeoId) {
  const videoData = await vimeo.fetch('GET', `/videos/${vimeoId}`)

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

  var mentorFound = null
  if (!_.isEmpty(mentor)) {
    mentorFound = await Mentor.findOne({ ...mentor })
    if (!mentorFound) createError(409, `Mentor [${mentor}] does not exists`)
  }

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
    mentor: _.get(mentorFound, '_id', null),
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

async function uploadLastClasses () {
  const body = {}
  const countOfVideosToGet = 12

  const videosData = await vimeo.fetch('GET', '/me/videos', body, { per_page: countOfVideosToGet })
  const data = _.get(videosData, 'data', [])

  //* Obteniendo los videos que son clases y que tenga contenido
  const lastClassesVideos = data.filter(video => ((video.name).includes('bootcamp') && video.duration > 0))

  const existingClassesPromises = lastClassesVideos.map(video => {
    const vimeoId = (video.uri).split('/')[2]

    return Class.findOne({ vimeoId })
  })
  const existingClasses = await Promise.all(existingClassesPromises)
  const classesToUpload = lastClassesVideos.filter((vimeoId, index) => !existingClasses[index])

  const classesRenamedPromises = classesToUpload.map(video => {
    const vimeoId = (video.uri).split('/')[2]
    const name = `${(video.name.includes('pyhton')) ? 'python' : 'js'}-${(video.name).split('-')[2]}gen-${dayjs(video.created_time).format('DD/MM/YYYY')}`
    return vimeo.fetch('PATCH', `/videos/${vimeoId}`, { name })
  })

  const classesRenamed = await Promise.all(classesRenamedPromises)

  const classesToSavePromises = classesRenamed.map(classVideo => {
    const number = vimeo.constants.generations[(classVideo.name.split('-')[1]).trim()].number

    const vimeoId = (classVideo.uri).split('/')[2]
    const classData = {
      vimeoId,
      generation: {
        number,
        type: 'white'
      }
    }

    return create(classData)
  })

  const classesSaved = await Promise.all(classesToSavePromises)
  const classesMoved = classesSaved.map((classDB) => {
    // ToDo: FolderId dinamico
    const userId = vimeo.constants.users.kodemia.id
    const projectId = vimeo.constants.folders['9na-generación'].id
    const vimeoId = classDB.vimeoId
    return vimeo.fetch('PUT', `/users/${userId}/projects/${projectId}/videos/${vimeoId}`, null)
  })
  await Promise.all(classesMoved)
}

module.exports = {
  create,
  getAll,
  getListByUser,
  uploadLastClasses
}
