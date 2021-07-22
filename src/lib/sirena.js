
const fetch = require('node-fetch')
const querystring = require('querystring')
const constants = require('../config/sirena.json')

const { SIRENA_API_KEY, SIRENA_API_HOST } = process.env

async function sirenaFetch(method = 'GET', endpoint = '', body = {}, queryParams = {}) {
  endpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  const queryParamsString = querystring.stringify({
    ...queryParams,
    'api-key': SIRENA_API_KEY
  })

  const response = await fetch(
    `${SIRENA_API_HOST}${endpoint}?${queryParamsString}`,
    {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: method === 'GET' ? null : JSON.stringify(body)
    }
  )

  if (response.status >= 400) {
    const { message } = await response.json()
    throw message
  }

  return response.json()
}

module.exports = {
  constants,
  fetch: sirenaFetch
}
