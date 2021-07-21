
const fetch = require('node-fetch')
const querystring = require('querystring')
const constants = require('../config/sirena.json')

const { SIRENA_API_KEY, SIRENA_API_HOST } = process.env

async function sirenaFetch(method = 'GET', endpoint = '', body = {}, queryParams = {}) {
  endpoint = endpoint.startsWith('/') ? `${endpoint}?api-key=${SIRENA_API_KEY}` : `/${endpoint}?api-key=${SIRENA_API_KEY}`

  const queryParamsString = querystring.stringify(queryParams)

  const response = await fetch(
    `${SIRENA_API_HOST}${endpoint}&${queryParamsString}`,
    {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: method === 'GET' ? null : JSON.stringify(body)
    }
  )
  if (response.status) {
    const { message } = await response.json()
    throw message
  }

  return response.json()
}

module.exports = {
  constants,
  fetch: sirenaFetch
}
