
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
  NODE_ENV
} = process.env

const authUrl = (NODE_ENV || VERCEL_ENV) === 'production'
  ? 'account.docusign.com'
  : 'account-d.docusign.com'

async function getToken() {
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

async function getUserDefaultAccountInfo(token) {
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

async function request(url = '', config = {}) {
  const token = await getToken()
  const accountInfo = await getUserDefaultAccountInfo(token)
  url = url.startsWith('/') ? url : `/${url}`
  const baseUrl = `${accountInfo.base_uri}/restapi/v2.1/accounts/${accountInfo.account_id}${url}`
  console.log('baseUrlll: ', baseUrl)

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

async function worker(signerEmail, signerName) {
  let envelopeArgs = {
    signerEmail: 'naomi@kodemia.mx ',
    signerName: 'Rose',
    ccEmail: 'arianaomi.lp@gmail.com',
    ccName: 'Naomi',
    status: 'sent'
  }
  console.log('worker', envelopeArgs)

  const token = await getToken()
  const accountInfo = await getUserDefaultAccountInfo(token)
  const baseUrl = `${accountInfo.base_uri}/restapi`

  let dsApiClient = new docusign.ApiClient()
  dsApiClient.setBasePath(baseUrl)
  dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + token)

  let envelopesApi = new docusign.EnvelopesApi(dsApiClient)

  let results = null

  // Step 1. Make the envelope request body
  let envelope = makeEnvelope(envelopeArgs)


  // Step 2. call Envelopes::create API method
  // Exceptions will be caught by the calling function
  console.log('id', accountInfo.account_id)
  results = await envelopesApi.createEnvelope(accountInfo.account_id, { envelopeDefinition: envelope })
  let envelopeId = results.envelopeId

  console.log(`Envelope was created. EnvelopeId ${envelopeId}`)
  return ({ envelopeId: envelopeId })
}

function makeEnvelope(args) {
  // Step 1: Create the envelope definition
  let env = new docusign.EnvelopeDefinition()
  env.emailSubject = 'Carta oferta Kodemia'

  let doc1 = new docusign.Document()
  let doc1b65 = Buffer.from(document1(args)).toString('base64')

  doc1.documentBase64 = doc1b65
  doc1.name = 'Carta oferta'
  doc1.fileExtension = 'html'
  doc1.documentId = '1'

  env.documents = [doc1]

  let signer1 = docusign.Signer.constructFromObject({
    email: args.signerEmail,
    name: args.signerName,
    recipientId: '1',
    routingOrder: '1'
  })

  let cc1 = new docusign.CarbonCopy()
  cc1.email = args.ccEmail
  cc1.name = args.ccName
  cc1.routingOrder = '2'
  cc1.recipientId = '2'

  let signHere1 = docusign.SignHere.constructFromObject({
    anchorString: '**signature_1**',
    anchorYOffset: '10',
    anchorUnits: 'pixels',
    anchorXOffset: '20'
  })

  // Tabs are set per recipient / signer
  let signer1Tabs = docusign.Tabs.constructFromObject({
    signHereTabs: [signHere1]
  })

  signer1.tabs = signer1Tabs

  let recipients = docusign.Recipients.constructFromObject({
    signers: [signer1],
    carbonCopies: [cc1]
  })
  env.recipients = recipients
  env.status = args.status

  return env
}

function document1(args) {
  return `
    <!DOCTYPE html>
    <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family:sans-serif;margin-left:2em;">
        <h1 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
            color: darkblue;margin-bottom: 0;">Enviado desde API Kodemia</h1>
        <h2 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
          margin-top: 0px;margin-bottom: 3.5em;font-size: 1em;
          color: darkblue;">:)</h2>
        <h4>Estimad@ ${args.signerName}</h4>
        <p style="margin-top:3em;">
          Ha sido un placer conocer tus inquietudes y propósitos como desarrollador web.
          En Kodemia estamos exageradamente comprometidos con el desarrollo de tu talento como
          desarrollador, por lo que te extendemos la presente carta oferta para el Bootcamp “Full-Stack developer
          JavaScript” en modalidad “Live” que iniciamos el próximo fechita fechita.
        </p>
        <!-- Note the anchor tag for the signature field is in white. -->
        <h3 style="margin-top:3em;">Agreed: <span style="color:white;">**signature_1**/</span></h3>
        </body>
    </html>
  `
}

module.exports = {
  getToken,
  getUserDefaultAccountInfo,
  request,
  worker
}
