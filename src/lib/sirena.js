
const fetch = require('node-fetch')
const querystring = require('querystring')

const { SIRENA_API_KEY, SIRENA_API_HOST } = process.env

console.log(SIRENA_API_KEY, SIRENA_API_HOST)

async function sirenaFetch (method = 'GET', endpoint = '', body = {}, queryParams = {}) {
  endpoint = endpoint.startsWith('/') ? `${endpoint}?api-key=${SIRENA_API_KEY}` : `/${endpoint}?api-key=${SIRENA_API_KEY}`

  const queryParamsString = querystring.stringify(queryParams)

  const response = await fetch(
    `${SIRENA_API_HOST}${endpoint}&${queryParamsString}`,
    {
      method,
      body: method === 'GET' ? null : JSON.stringify(body)
    }
  )
  if (!response.ok) {
    const { errors } = await response.json()
    throw errors
  }

  return response.json()
}

module.exports = {
  fetch: sirenaFetch
}
