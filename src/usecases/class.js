
const createError = require('http-errors')
const _ = require('lodash')
const utils = require('../lib/utils')
const dayjs = require('dayjs')

const Class = require('../models/class').model
const Mentor = require('../models/mentor').model
const Generation = require('../models/generation').model

const vimeo = require('../lib/vimeo')

// i.e bootcamp-javascript-10
const newVideoNameFormat = new RegExp('^bootcamp-[a-z]+-[0-9]{2,}', 'i')

// i.e javascript-10-06/06/2020
const renamedVideoFormat = new RegExp('^[a-z]+-[0-2]{2,}-[0-9]{2}/[0-9]{2}/[0-9]{4}', 'i')

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

  const existingClass = await Class.findOne({ vimeoId, generation: generationFound.id })
  if (existingClass) throw createError(409, `Class with vimeoId [${vimeoId}] already exists in ${generation.type}-${generation.number}`)

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

async function getLastClassesFromVimeo (countOfVideosToGet = 20) {
  const videosData = await vimeo.fetch('GET', '/me/videos', null, { per_page: countOfVideosToGet })
  const videos = _.get(videosData, 'data', [])

  /* Get class videos with content */
  return videos
    .filter(video => {
      const isNewVideo = newVideoNameFormat.test(video.name)
      const isAlreadyRenamedVideo = renamedVideoFormat.test(video.name)
      const hasContent = video.duration > 0
      return hasContent && (isNewVideo | isAlreadyRenamedVideo)
    })
    .map(video => {
      return {
        id: vimeo.utils.getVideoIdFromUri(video.uri),
        name: video.name,
        createdDate: video.created_time
      }
    })
}

async function getClassesToUpload () {
  const lastClassesVideos = await getLastClassesFromVimeo()

  const existingClassesPromises = lastClassesVideos.map(vimeoClassVideo => {
    return Class.findOne({ vimeoId: vimeoClassVideo.id })
  })
  const existingClasses = await Promise.all(existingClassesPromises)
  const existingClassesIds = existingClasses
    .filter(klass => !!klass)
    .map(klass => klass.vimeoId)

  const lastClassesVideosIds = lastClassesVideos.map(classVideo => classVideo.id)
  const classesToUploadIds = _.difference(lastClassesVideosIds, existingClassesIds)
  const classesToUpload = lastClassesVideos.filter(classVideo => classesToUploadIds.includes(classVideo.id))

  return classesToUpload
}

function createNewNamesForClassesToUpload (classesToUpload = []) {
  return classesToUpload.map(classVideo => {
    const needNewName = newVideoNameFormat.test(classVideo.name)
    let newName = null

    if (needNewName) {
      const [ , program, generation ] = classVideo.name.split('-')
      const classDate = dayjs(classVideo.createdDate).format('DD/MM/YYYY')
      newName = `${program}-${generation}-${classDate}`
      return {
        ...classVideo,
        newName,
        program,
        generation,
        needNewName
      }
    }

    const [ program, generation ] = classVideo.name.split('-')

    return {
      ...classVideo,
      newName,
      needNewName,
      program,
      generation
    }
  })
}

async function getAllVimeoFolders () {
  const allFoldersResponse = await vimeo.fetch('GET', '/me/projects', null, { per_page: 100 })
  const allFolders = _.get(allFoldersResponse, 'data', [])
  const allFoldersByNameAndId = allFolders.map(folder => {
    const id = _.last(_.get(folder, 'uri', '').split('/'))
    return {
      id,
      name: folder.name
    }
  })
  return allFoldersByNameAndId
}

async function createNeededVimeoFolders (foldersNeededNames = []) {
  let allFolders = await getAllVimeoFolders()
  foldersNeededNames = _.uniq(foldersNeededNames)

  const foldersToCreate = foldersNeededNames.filter(folderNeededName => {
    return !allFolders.find(folder => folder.name === folderNeededName)
  })

  const foldersToCreatePromises = foldersToCreate.map(folderToCreate => {
    return vimeo.fetch('POST', '/me/projects', { name: folderToCreate })
  })
  return Promise.all(foldersToCreatePromises)
}

async function uploadLastClasses () {
  const classesToUpload = await getClassesToUpload()

  const classesToUploadWithNewNames = createNewNamesForClassesToUpload(classesToUpload)

  // rename classes
  const classesRenamedPromises = classesToUploadWithNewNames
    .filter(classVideo => classVideo.needNewName)
    .map(classVideo => {
      return vimeo.fetch('PATCH', `/videos/${classVideo.id}`, { name: classVideo.newName })
    })
  await Promise.all(classesRenamedPromises)

  // save classes in the db
  const classesToSavePromises = classesToUploadWithNewNames.map(classVideo => {
    const classData = {
      vimeoId: classVideo.id,
      generation: {
        number: classVideo.generation,
        type: classVideo.program
      }
    }
    return create(classData)
  })
  await Promise.all(classesToSavePromises)

  // move class videos to its correspondent folder
  let foldersNeededNames = classesToUploadWithNewNames
    .map(classVideo => `${classVideo.program}-${classVideo.generation}`)

  await createNeededVimeoFolders(foldersNeededNames)
  const allFolders = await getAllVimeoFolders()

  const classesToPutInAFolder = classesToUploadWithNewNames.map(classVideo => {
    const folderName = `${classVideo.program}-${classVideo.generation}`
    const folder = allFolders.find(folder => folder.name === folderName)
    return {
      ...classVideo,
      folderId: folder.id
    }
  })

  const classesToPutInAFolderPromises = classesToPutInAFolder.map(classVideo => {
    return vimeo.fetch('PUT', `/me/projects/${classVideo.folderId}/videos/${classVideo.id}`, null)
  })

  await Promise.all(classesToPutInAFolderPromises)

  return classesToUploadWithNewNames
}

module.exports = {
  create,
  getAll,
  getListByUser,
  getClassesToUpload,
  uploadLastClasses,
  getLastClassesFromVimeo,
  createNewNamesForClassesToUpload,
  getAllVimeoFolders
}
