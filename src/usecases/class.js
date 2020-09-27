
const createError = require('http-errors')
const _ = require('lodash')
const utils = require('../lib/utils')
const moment = require('moment')

const Class = require('../models/class').model
const Generation = require('../models/generation').model

const vimeo = require('../lib/vimeo')

async function getVimeoVideoData (vimeoId) {
  const videoData = await vimeo.videoFetchById(vimeoId)

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

    generation = {},
    vimeoId
  } = classData
  console.log(generation)

  const generationFound = await Generation.findOne({
    type: generation.type,
    number: generation.number
  })
  if (!generationFound) createError(409, `Generation [${generation.type}, ${generation.number}] does not exists`)

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

async function classUploadLast () {
  const countOfVideosToGet = 10
  const videosData = await vimeo.getLastVideos(countOfVideosToGet)
  const data = _.get(videosData, 'data', [])

  const classVideos = data.filter(video => ((video.name).includes('bootcamp') && video.duration > 0))

  const existingClassPromises = classVideos.map(video => {
    const vimeoId = (video.uri).split('/')[2]
    console.log(vimeoId)
    return Class.findOne({ vimeoId })
  })
  const existingClasses = await Promise.all(existingClassPromises)
  const classToUpload = classVideos.filter((vimeoId, index) => !existingClasses[index])

  const classAlreadyUploadPromise = classToUpload.map(element => {
    const id = (element.uri).split('/')[2]
    const newName = `${(element.name.includes('pyhton')) ? 'python' : 'js'}-${(element.name).split('-')[2]}gen -${moment(element.created_time).format('L')}`

    return vimeo.updateVideoName(id, newName)
  })
  const classAlreadyUpload = await Promise.all(classAlreadyUploadPromise)

  const classesSaveDBPromise = classAlreadyUpload.map(classUpload => {
    const number = vimeo.constants.generations[classUpload.name.split(' ')[1]].number
    const vimeoId = (classUpload.uri).split('/')[2]
    const classData = {
      vimeoId,
      generation: {
        number,
        type: 'white'
      }
    }

    return create(classData)
  })

  const classesSaveDB = await Promise.all(classesSaveDBPromise)
  const classesMoved = classesSaveDB.map((classDB) => {
    // ToDo: FolderId dinamico
    return vimeo.putVideoInFolder(vimeo.constants.users.kodemia.id, vimeo.constants.folders['9na-generación'].id, classDB.vimeoId)
  })
  await Promise.all(classesMoved)
}

module.exports = {
  create,
  getAll,
  getListByUser,
  classUploadLast
}
