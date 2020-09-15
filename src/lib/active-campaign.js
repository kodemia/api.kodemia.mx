const querystring = require('querystring')
const fetch = require('node-fetch')

const constants = require('../config/active-campaign.json')

const { AC_API_KEY, AC_API_HOST } = process.env

async function acFetch (
  method = 'GET',
  endpoint = '',
  body = {},
  queryParams = {},
  extraConfig = {}
) {
  endpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const queryParamsString = querystring.stringify(queryParams)

  const headers = {
    'Api-token': AC_API_KEY,
    'Content-Type': 'application/json'
  }

  const response = await fetch(
    `${AC_API_HOST}/api/3${endpoint}?${queryParamsString}`,
    {
      method,
      headers,
      body: method === 'GET' ? null : JSON.stringify(body),
      ...extraConfig
    }
  )

  if (!response.ok) {
    const { errors } = await response.json()
    throw errors
  }

  return response.json()
}

module.exports = {
  constants,
  fetch: acFetch
}
