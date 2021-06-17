
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const FormData = require('form-data')
const createError = require('http-errors')

const {
  DOCUSIGN_PRIVATE_KEY,
  ENV,
  DOCUSIGN_INTEGRATION_KEY,
  DOCUSIGN_USER_ID
} = process.env

const authUrl = ENV === 'production'
  ? 'account.docusign.com'
  : 'account-d.docusign.com'

async function getToken () {
  let token = null
  const requestAccessTokenJWTPayload = {
    iss: DOCUSIGN_INTEGRATION_KEY,
    sub: DOCUSIGN_USER_ID,
    aud: authUrl,
    scope: 'signature impersonation'
  }
  const requestAccessTokenJWT = jwt.sign(
    requestAccessTokenJWTPayload,
    DOCUSIGN_PRIVATE_KEY,
    { algorithm: 'RS256', expiresIn: '10s' }
  )

  const requestAccessTokenData = new FormData()
  requestAccessTokenData.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer')
  requestAccessTokenData.append('assertion', requestAccessTokenJWT)

  const responseRequestAccessToken = await fetch('https://account-d.docusign.com/oauth/token', {
    method: 'POST',
    body: requestAccessTokenData
  })

  try {
    const responseRequestAccessTokenJSON = await responseRequestAccessToken.json()
    const { access_token: accessToken } = responseRequestAccessTokenJSON
    token = accessToken
  } catch (docusignError) {
    throw createError(500, `Could not create DocuSign token: ${docusignError.message}`)
  }

  return token
}

module.exports = {
  getToken
}
