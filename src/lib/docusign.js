
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const FormData = require('form-data')
const createError = require('http-errors')
// const docusign = require('docusign-esign')

const {
  DOCUSIGN_PRIVATE_KEY,
  VERCEL_ENV,
  DOCUSIGN_INTEGRATION_KEY,
  DOCUSIGN_USER_ID,
  NODE_ENV
} = process.env

const authUrl = (NODE_ENV || VERCEL_ENV) === 'production'
  ? 'account.docusign.com'
  : 'account-d.docusign.com'

async function getToken () {
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

  const responseRequestAccessToken = await fetch(`https://${authUrl}/oauth/token`, {
    method: 'POST',
    body: requestAccessTokenData
  })

  try {
    const responseRequestAccessTokenJSON = await responseRequestAccessToken.json()
    const { access_token: accessToken } = responseRequestAccessTokenJSON

    return accessToken
  } catch (docusignError) {
    throw createError(500, `Could not create DocuSign token: ${docusignError.message}`)
  }
}

async function getUserDefaultAccountInfo (token) {
  if (!token) {
    token = await getToken()
  }

  const userUriResponse = await fetch(`https://${authUrl}/oauth/userinfo`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })

  try {
    const jsonResponse = await userUriResponse.json()
    const accounts = _.get(jsonResponse, 'accounts', [])
    const defaultAccount = accounts.find(account => account.is_default)

    if (!defaultAccount) {
      throw createError(404, 'Default account not found for this DocuSign user')
    }

    return defaultAccount
  } catch (error) {
    throw createError(500, `Could not get BaseUri for this DocuSign user: ${error.message}`)
  }
}

async function request (url = '', config = {}) {
  const token = await getToken()
  const accountInfo = await getUserDefaultAccountInfo(token)
  url = url.startsWith('/') ? url : `/${url}`
  const baseUrl = `${accountInfo.base_uri}/restapi/v2.1/accounts/${accountInfo.account_id}${url}`
  console.log('baseUrl: ', baseUrl)

  const { headers: configHeaders, ...restConfig } = config

  const response = await fetch(baseUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      ...configHeaders
    },
    ...restConfig
  })
  try {
    const responseJSON = await response.json()
    return responseJSON
  } catch (error) {
    throw createError(500, error.message)
  }
}

// ToDo: In progress
// async function makeEnvelope (templateId, signerEmail, signerName) {
//   if (!templateId) throw createError(500, 'template id is required to make an envelop')

//   const envelop = docusign.EnvelopeDefinition()
//   envelop.templateId = templateId

//   const signer = docusign.TemplateRole()
//   signer.email = signerEmail
//   signer.name = signerName
//   signer.roleName = 'signer'

//   const cc = docusign.TemplateRole()
//   cc.email = signerEmail
//   cc.name = signerName
//   cc.roleName = 'cc'

//   envelop.templateRoles = [ signer, cc ]
//   envelop.status = 'sent'
//   return envelop
// }

module.exports = {
  getToken,
  getUserDefaultAccountInfo,
  request
}
