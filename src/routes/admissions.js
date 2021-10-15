const Router = require('koa-router')
const dayjs = require('dayjs')

const offer = require('../usecases/offer')

const router = new Router({
  prefix: '/admissions'
})

router.post('/offer', async ctx => {
  /* payload
  {
    "signerEmail": "rose@kodemia.mx",
    "signerName": "Rose Tech",
    "offer": {
      "deadline": "02/07/2021",
      "amountToFinance":"60000",
      "inscription": 3000,
      "paymentScheme":"Accede",
      "totalPayments": 12,
      "monthlyPayment": 2500,
      "startBootcampDate": "02/07/2021"
    },
  }
*/
  let {
    signerEmail,
    signerName,
    offer: offerData = offer.defaultOfferData
  } = ctx.request.body

  offerData = {
    deadline: dayjs().add(1, 'week').format('DD/MM/YYYY'),
    signerName,
    ...offerData
  }

  const response = await offer.send(signerEmail, signerName, offerData)

  ctx.resolve({
    message: `Offer sent to ${signerEmail}`,
    payload: {
      envelopeId: response
    }
  })
})

module.exports = router
