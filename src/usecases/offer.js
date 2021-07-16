
const fs = require('fs-extra')
const Handlebars = require('../lib/handlebars')
const docusign = require('../lib/docusign')

const defaultOfferData = {
  signerName: null,
  startBootcampDate: null,
  amountToFinance: null,
  inscription: null,
  paymentScheme: null,
  totalPayments: null,
  monthlyPayment: null,
  deadline: null
}

async function send (applicantEmail, applicantName, offerData = defaultOfferData) {
  let fileUrl = './src/templates/offer.hbs'
  if (process.env.VERCEL) {
    fileUrl = `.${fileUrl}`
  }

  console.log('fileUrl: ', fileUrl, process.cwd)
  const offerDocumentTemplateHTML = fs.readFileSync(fileUrl, 'utf8')
  const offerDocumentTemplate = Handlebars.compile(offerDocumentTemplateHTML)
  const offerDocumentString = offerDocumentTemplate(offerData)
  return docusign.sendDocumentToBeSigned(applicantEmail, applicantName, offerDocumentString)
}

module.exports = {
  send,
  defaultOfferData
}
