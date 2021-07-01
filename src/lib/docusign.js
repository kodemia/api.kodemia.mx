
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const FormData = require('form-data')
const createError = require('http-errors')
const docusign = require('docusign-esign')

const Handlebars = require('handlebars')

const {
  DOCUSIGN_PRIVATE_KEY,
  VERCEL_ENV,
  DOCUSIGN_INTEGRATION_KEY,
  DOCUSIGN_USER_ID,
  DOCUSIGN_CCEMAIL,
  DOCUSIGN_CCNAME,
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

async function worker (signerEmail, signerName, offerLetter) {
  let envelopeArgs = {
    signerEmail,
    signerName,
    ccEmail: DOCUSIGN_CCEMAIL,
    ccName: DOCUSIGN_CCNAME,
    status: 'sent',
    offerLetter
  }

  const token = await getToken()
  const accountInfo = await getUserDefaultAccountInfo(token)
  const baseUrl = `${accountInfo.base_uri}/restapi`

  let dsApiClient = new docusign.ApiClient()
  dsApiClient.setBasePath(baseUrl)
  dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + token)

  let envelopesApi = new docusign.EnvelopesApi(dsApiClient)

  // Step 1. Make the envelope request body
  let envelope = makeEnvelope(envelopeArgs)

  // Step 2. call Envelopes::create API method
  let results = await envelopesApi.createEnvelope(accountInfo.account_id, { envelopeDefinition: envelope })
  let envelopeId = results.envelopeId

  return ({ envelopeId: envelopeId })
}

function makeEnvelope (args) {
  // Step 1: Create the envelope definition
  let envelop = new docusign.EnvelopeDefinition()
  envelop.emailSubject = 'Carta oferta Kodemia'

  let doc1 = new docusign.Document()
  let doc1b65 = Buffer.from(document1(args.offerLetter)).toString('base64')

  doc1.documentBase64 = doc1b65
  doc1.name = 'Carta oferta'
  doc1.fileExtension = 'html'
  doc1.documentId = '1'

  envelop.documents = [doc1]

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
  envelop.recipients = recipients
  envelop.status = args.status

  return envelop
}

function document1 (args) {
  let template = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8" />
    <style>
      .title {
        font-size: 18px;
        text-align: end;
        display: block;
      }
      h3 {
        margin: 2px;
        font-size: 12px;
      }
      p {
        white-space: pre-line;
        font-size: 12px;
        margin: 0px;
      }
      table {
        border-top: 1px solid black;
        width: 100%;
        font-size: 12px;
      }
      tr {
        height: 30px;
        padding: 0px;
      }
      tr:nth-child(odd) {
        background-color: gray;
      }
      th {
        text-align: start;
        width: 25%;
        border-right: 1px solid black;
        padding: 0px;
      }
      td {
        padding: 0px;
      }
      .sign-container {
        display: flex;
        border: 2px solid black;
      }
      div {
        display:inline-block
      }
      .banco {
        width: 70%;
        border-right: 2px solid black;
      }
      .sign {
        width: 30%;
        text-align: center;
      }
    </style>
    </head>
    <body>
    <main>
      <h1 class="title">Carta Oferta</h1>
      <h3>Estimad@ {{signerName}}</h3>
      <p style="white-space: pre-line; text-align:end;">
        <br>Ha sido un placer conocer tus inquietudes y propósitos como desarrollador web.<br><br>

        En Kodemia estamos exageradamente comprometidos con el desarrollo de tu talento como desarrollador, por lo que te extendemos la presente carta oferta para el Bootcamp <strong>“Full-Stack developer JavaScript”</strong> en modalidad <strong>“Live”</strong> que iniciamos el próximo {{startBootcamp}}.<br><br>

       Este bootcamp te permitirá́entender inicialmente la forma de pensar de un gran programador, a través de los fundamentos de programación y la resolución de algoritmos, dándote el entendimiento claro de la estructura de programación para adoptar cualquier lenguaje en el futuro. Así como consolidarte en el mundo del desarrollo Web creando una aplicación que combina tus nuevas habilidades de Front-end y Back-end con patrones de diseño, todo lo anterior consolidado en el bootcamp.<br><br>

       Luego de conocer tus expectativas, nos gustaría trabajar contigo durante este bootcamp y por ello, te presentamos el programa con el siguiente <strong>esquema de financiamiento</strong> , Quedando de la siguiente manera: <br><br>
      </p>
      <h3>INVERSIÓN REGULAR CON IVA:</h3>
      <br>
      <table>
        <tr style=" background-color: gray">
          <th>MONTO A FINANCIAR</th>
          <td>{{amountToFinance}}</td>
        </tr>
        <tr >
          <th>INSCRIPCIÓN</th>
          <td>{{inscription}}</td>
        </tr>
        <tr style=" background-color: gray">
          <th>ESQUEMA DE PAGO</th>
          <td>{{paymentScheme}}</td>
        </tr>
        <tr >
          <th>PAGOS TOTALES</th>
          <td>{{totalPayments}}</td>
        </tr>
        <tr style=" background-color:gray;">
          <th>MONTO MENSUAL</th>
          <td>{{monthlyPayment}}</td>
        </tr>
      </table>
      <br>
      <p>
        *La presente carta oferta tiene vigencia limite al {{deadline}}para realizar la inscripción.
        <br><br>
        **Después de la aplicación con Accede se tiene un total de 10 días hábiles para concluir el proceso de financiamiento.
        <br><br>
         *Al aprobarse el financiamiento, Accede solicita el 5%por apertura de contrato del monto solicitado.<br><br>
      </p>
      <article class="sign-container" >
        <div class="banco">
          <h3>Datos Bancarios</h3>
          <p>
            Banco BBVA <br> Titular: Kodemia SC <br> Número de cuenta: 0113364240 <br>
            CLABE: 012180001133642404<br>
          </p>
        </div>
        <div>
          <h3>Firma del alumno</h3>
          <br>
          <span style="color: white">**signature_1**/</span>
        </div>
      </article>
    </main>
    <footer>
    <p style="text-align: center;">Kodemia es tu casa: COW Roma, <br> Tonalá 10, Roma norte, 03800, CDMX.</p>
    </footer>
  </body>
</html>
  `
  var template2 = Handlebars.compile(template)
  var result = template2(args)
  return result
}

module.exports = {
  getToken,
  getUserDefaultAccountInfo,
  request,
  worker
}
