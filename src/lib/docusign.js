
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const FormData = require('form-data')
const createError = require('http-errors')
const docusign = require('docusign-esign')

const {
  DOCUSIGN_PRIVATE_KEY,
  VERCEL_ENV,
  DOCUSIGN_INTEGRATION_KEY,
  DOCUSIGN_USER_ID,
  DOCUSIGN_CCEMAIL,
  DOCUSIGN_CCNAME,
  NODE_ENV
} = process.env

const authUrl = (VERCEL_ENV || NODE_ENV) === 'production'
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

async function getEnvelopApiClient () {
  const token = await getToken()
  const accountInfo = await getUserDefaultAccountInfo(token)
  const baseUrl = `${accountInfo.base_uri}/restapi`

  let dsApiClient = new docusign.ApiClient()
  dsApiClient.setBasePath(baseUrl)
  dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + token)

  return {
    client: new docusign.EnvelopesApi(dsApiClient),
    accountInfo
  }
}

async function sendDocumentToBeSigned (signerEmail, signerName, documentString) {
  let { client, accountInfo } = await getEnvelopApiClient()

  // Step 1. Make the envelope request body
  let envelopeDefinition = makeEnvelope({ signerEmail, signerName }, documentString)

  // Step 2. call Envelopes::create API method
  let results = await client.createEnvelope(accountInfo.account_id, { envelopeDefinition })
  let envelopeId = results.envelopeId

  return { envelopeId }
}

function makeEnvelope ({
  signerEmail,
  signerName,
  ccEmail = DOCUSIGN_CCEMAIL,
  ccName = DOCUSIGN_CCNAME,
  status = 'sent'
}, documentString) {
  // Step 1: Create the envelope definition
  let envelop = new docusign.EnvelopeDefinition()
  envelop.emailSubject = 'Kodemia | Carta oferta'

  let document = new docusign.Document()

  document.documentBase64 = Buffer.from(documentString).toString('base64')
  document.name = 'Carta oferta'
  document.fileExtension = 'html'
  document.documentId = '1'

  envelop.documents = [document]

  let signer = docusign.Signer.constructFromObject({
    email: signerEmail,
    name: signerName,
    recipientId: '1',
    routingOrder: '1'
  })

  let carbonCopy = new docusign.CarbonCopy()
  carbonCopy.email = ccEmail
  carbonCopy.name = ccName
  carbonCopy.routingOrder = '1'
  carbonCopy.recipientId = '2'

  let signHere1 = docusign.SignHere.constructFromObject({
    anchorString: '**signature_1**',
    anchorYOffset: '10',
    anchorUnits: 'pixels',
    anchorXOffset: '70'
  })

  // Tabs are set per recipient / signer
  let signer1Tabs = docusign.Tabs.constructFromObject({
    signHereTabs: [signHere1]
  })

  signer.tabs = signer1Tabs

  let recipients = docusign.Recipients.constructFromObject({
    signers: [signer],
    carbonCopies: [carbonCopy]
  })
  envelop.recipients = recipients
  envelop.status = status

  return envelop
}

module.exports = {
  getToken,
  getUserDefaultAccountInfo,
  request,
  sendDocumentToBeSigned,
  getEnvelopApiClient
}
