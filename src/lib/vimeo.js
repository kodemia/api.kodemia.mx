const querystring = require('querystring')
const fetch = require('node-fetch')

const constants = require('../config/vimeo.json')

const { VIMEO_TOKEN } = process.env

async function vimeoFetch (
  method = 'GET',
  endpoint = '',
  body = {},
  queryParams = {}) {
  console.log('VIMEO_TOKEN: ', VIMEO_TOKEN)
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

  const isJsonResponse = (response.headers.get('content-type') || '').includes('json')
  if (!response.ok && isJsonResponse) {
    const { errors } = await response.json()
    throw errors
  }

  return isJsonResponse ? response.json() : null
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
