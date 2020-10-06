
const _ = require('lodash')
const assert = require('http-assert')
const fetch = require('node-fetch')
const querystring = require('querystring')

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

// UTILS
function buildFieldValuesArrayFromObject (customFieldsObject = {}) {
  return Object.entries(customFieldsObject).map(([key, value]) => {
    const customFieldId = _.get(constants.contacts.customFields, `${key}.id`, null)
    assert(customFieldId, 404, `customField '${key}' does not exists`)

    return {
      field: `${customFieldId}`,
      value: `${key === 'campaignName' ? constants.contacts.customFields[key].values[value] : value}`
    }
  })
}

module.exports = {
  constants,
  fetch: acFetch,
  utils: {
    buildFieldValuesArrayFromObject
  }
}
