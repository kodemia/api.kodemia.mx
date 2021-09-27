
const fetch = require('node-fetch')
const querystring = require('querystring')
const createError = require('http-errors')
const constants = require('../config/sirena.json')
const Sentry = require('@sentry/node')

const { SIRENA_API_KEY, SIRENA_API_HOST } = process.env

async function sirenaFetch (method = 'GET', endpoint = '', body = {}, queryParams = {}) {
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
    const { message = 'no message' } = await response.json()

    Sentry.captureException(new Error(`[Sirena] fetch failed`), {
      extra: {
        method,
        endpoint,
        response
      }
    })
    throw createError(response.status, message)
  }

  return response.json()
}

module.exports = {
  constants,
  fetch: sirenaFetch
}
