const Router = require('koa-router')
const { getProspectId } = require('../usecases/sirena')

const router = new Router({
  prefix: '/sirena'
})

router.get('/', ctx => {
  ctx.resolve({
    message: 'endppoint sirema'
  })
})

router.post('/send-message', async ctx => {
  console.log(ctx.request.body)
  // const { email } = ctx.request.body

  // if (!email) throw ctx.throw(400, 'Email is required')
  // await getProspectId(email)

  // console.log(email)
  ctx.resolve({
    message: email
  })
})

router.post

module.exports = router
