
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
  const countOfVideosToGet = 20

  const videosData = await vimeo.fetch('GET', '/me/videos', null, { per_page: countOfVideosToGet })
  const data = _.get(videosData, 'data', [])

  /* Obteniendo los videos tipo clases y que tengan contenido */
  const lastClassesVideos = data.filter(
    video => ((video.name).includes('bootcamp') && video.duration > 0)
  )

  const existingClassesPromises = lastClassesVideos.map(video => {
    const vimeoId = vimeo.utils.getVideoIdFromUri(video.uri)
    return Class.findOne({ vimeoId })
  })
  const existingClasses = await Promise.all(existingClassesPromises)

  const classesToUpload = lastClassesVideos.filter(
    (vimeoId, index) => !existingClasses[index]
  )
  const classesRenamedPromises = classesToUpload.map(video => {
    const vimeoId = vimeo.utils.getVideoIdFromUri(video.uri)

    const generationType = video.name.includes('pyhton')
      ? 'python'
      : 'js'

    const generationNumber = (video.name || '').split('-')[2] || ''
    if (!generationNumber) throw createError(400, 'Video misnamed')

    const classDate = dayjs(video.created_time).format('DD/MM/YYYY')

    const name = `${generationType}-${generationNumber}-${classDate}`

    return vimeo.fetch('PATCH', `/videos/${vimeoId}`, { name })
  })
  const classesRenamed = await Promise.all(classesRenamedPromises)

  const classesToSavePromises = classesRenamed.map(classVideo => {
    const generationType = classVideo.name.includes('pyhton')
      ? 'python'
      : 'js'

    const number = (classVideo.name.split('-')[1] || '').trim()
    const vimeoId = vimeo.utils.getVideoIdFromUri(classVideo.uri)

    const classData = {
      vimeoId,
      generation: {
        number,
        type: generationType
      }
    }

    return create(classData)
  })

  const savedClasses = await Promise.all(classesToSavePromises)
  const movedClassessPromises = savedClasses.map(klass => {
    const userId = vimeo.constants.users.kodemia.id
    const generationNumber = klass.generation.number
    const generationType = klass.generation.type

    const generation = vimeo.constants.generations[generationType]
      .find(gen => generationNumber === gen.number)

    const vimeoId = klass.vimeoId

    return vimeo.fetch('PUT', `/users/${userId}/projects/${generation.folder}/videos/${vimeoId}`, null)
  })
  await Promise.all(movedClassessPromises)
}

module.exports = {
  create,
  getAll,
  getListByUser,
  uploadLastClasses
}
