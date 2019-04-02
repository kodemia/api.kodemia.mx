const Router = require('koa-router')
const jwt = require('../lib/jwt')

const koder = require('../usecases/koder')

const router = new Router({
  prefix: '/koders'
})

router.get('/', async ctx => {
  const koders = await koder.getAll()

  const publicKoders = koders.map(koder => {
    const {
      firstName,
      lastName,
      email,
      generation
    } = koder

    return {
      firstName,
      lastName,
      email,
      generation
    }
  })

  ctx.resolve({
    message: `Koders list`,
    payload: {
      koders: publicKoders
    }
  })
})

router.post('/', async ctx => {
  const {
    firstName = '',
    lastName = '',
    email = '',
    password = '',
    phone = '',
    generation = {
      type: 'white',
      number: 0
    }
  } = ctx.request.body

  const newKoder = await koder.create({ firstName, lastName, email, password, phone, generation })

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
  const token = await jwt.sign({ id: koderSignedIn._id })

  console.warn({ email, password })
  ctx.resolve({
    message: `${koderSignedIn.email} Signed in successfully`,
    payload: {
      token
    }
  })
})

router.post('/reset-password', async ctx => {
  const { email, password } = ctx.request.body

  if (!email) throw ctx.throw(400, 'Email is required')
  if (!password) throw ctx.throw(400, 'Password is required')

  await koder.resetPassword(email, password)

  ctx.resolve({
    message: `Password updated for ${email}`
  })
})

module.exports = router
