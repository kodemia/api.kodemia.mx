const Router = require('koa-router')

const koder = require('../usecases/koder')

const router = new Router({
  prefix: '/koders'
})

router.get('/', async ctx => {
  const koders = koder.getAll()

  ctx.resolve({
    message: `Koders list`,
    payload: {
      koders
    }
  })

})

router.post('/', async ctx => {
  const { firstName = '', lastName = '', email = '', password = ''} = ctx.request.body
  if (!firstName) throw ctx.throw(400, 'firstName is required')
  if (!lastName) throw ctx.throw(400, 'lastName is required')
  if (!email) throw ctx.throw(400, 'Email is required')
  if (!password) throw ctx.throw(400, 'password is required')

  const newKoder = await koder.create({ firstName, lastName, email, password})

  ctx.resolve({
    message: 'Koder created',
    payload: {
      koder: newKoder
    }
  })
})

router.post('/login', async ctx => {
  const { email, password } = ctx.request.body

  if (!email) throw ctx.throw(400, 'Email is required')
  if (!password) throw ctx.throw(400, 'Password is required')

  const koderSignedIn = await koder.sigIn(email, password)

  console.warn('  koderSignedIn ')
  
  console.warn({ email, password })
  ctx.resolve({
    message: 'login',
    payload: {
      koder: koderSignedIn
    }
  })
})


module.exports = router
