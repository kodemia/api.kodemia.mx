const querystring = require('querystring')
const fetch = require('node-fetch')

const constants = require('../config/vimeo.json')

const { VIMEO_TOKEN } = process.env

async function vimeoFetch (
  method = 'GET',
  endpoint = '',
  body = {},
  queryParams = {}) {
  endpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const queryParamsString = querystring.stringify(queryParams)
  const headers = {
    Authorization: `Bearer ${VIMEO_TOKEN}`, 'Content-Type': 'application/json'
  }

  const response = await fetch(`https://api.vimeo.com${endpoint}?${queryParamsString}`, {
    method,
    headers,
    body: method === 'GET' ? null : JSON.stringify(body)
  })

  let responseJson

  try {
    if (!response.ok) {
      const { errors } = await response.json()
      throw errors
    }
    responseJson = await response.json()
  } catch (error) {
    responseJson = null
  }

  return responseJson
}

// UTILS
function getVideoIdFromUri (videoUri = '') {
  if (typeof videoUri !== 'string') throw Error('Uri should be a string')
  return videoUri.split('/')[2]
}

module.exports = {
  constants,
  fetch: vimeoFetch,
  utils: {
    getVideoIdFromUri
  }
}
