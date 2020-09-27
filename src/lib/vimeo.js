const createError = require('http-errors')

const fetch = require('node-fetch')

const constants = require('../config/vimeo.json')

async function videoFetchById (vimeoId) {
  const videoDataResponse = await fetch(`https://api.vimeo.com/videos/${vimeoId}`, {
    headers: {
      Authorization: `Bearer ${process.env.VIMEO_TOKEN}`
    }
  })

  if (!videoDataResponse.ok) throw createError(404, `Class ${vimeoId} not found in vimeo`)
  return videoDataResponse.json()
}

async function getLastVideos (videosToFetch = 10) {
  const videosDataResponse = await fetch(`https://api.vimeo.com/me/videos?per_page=${videosToFetch}`, {
    headers: {
      Authorization: `Bearer ${process.env.VIMEO_TOKEN}`
    }
  })

  if (!videosDataResponse.ok) throw createError(404, 'Something went wrong getting videos')
  return videosDataResponse.json()
}

async function updateVideoName (vimeoId, newName) {
  const videoDataResponse = await fetch(`https://api.vimeo.com/videos/${vimeoId}`, {
    method: 'PATCH',
    body: JSON.stringify({ name: newName }),
    headers: {
      Authorization: `Bearer ${process.env.VIMEO_TOKEN}`, 'Content-Type': 'application/json'
    }
  })

  if (!videoDataResponse.ok) throw createError(404, `Class ${vimeoId} not found in vimeo`)

  return videoDataResponse.json()
}

async function putVideoInFolder (userId, projectId, vimeoId) {
  const videoDataResponse = await fetch(`https://api.vimeo.com/users/${userId}/projects/${projectId}/videos/${vimeoId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.VIMEO_TOKEN}`, 'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  })

  if (!videoDataResponse.ok) throw createError(404, `Class ${vimeoId} not found in vimeo`)

  return videoDataResponse.json()
}

async function getFoldersByUser (userId) {
  const videoDataResponse = await fetch(`https://api.vimeo.com/users/${userId}/projects`, {
    headers: {
      Authorization: `Bearer ${process.env.VIMEO_TOKEN}`
    }
  })

  if (!videoDataResponse.ok) throw createError(404, `User ${userId} not found in vimeo`)
  return videoDataResponse.json()
}

module.exports = {
  constants,
  videoFetchById,
  getLastVideos,
  updateVideoName,
  putVideoInFolder,
  getFoldersByUser

}
