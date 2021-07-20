
const Handlebars = require('../lib/handlebars')
const docusign = require('../lib/docusign')
const offerTemplate = require('../templates/offer.hbs')

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
  const offerDocumentTemplate = Handlebars.compile(offerTemplate)
  const offerDocumentString = offerDocumentTemplate(offerData)
  return docusign.sendDocumentToBeSigned(applicantEmail, applicantName, offerDocumentString)
}

module.exports = {
  send,
  defaultOfferData
}
