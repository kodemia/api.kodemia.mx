const Router = require('koa-router')
const jwt = require('../lib/jwt')

const koder = require('../usecases/koder')

const router = new Router({
  prefix: '/koders'
})

router.get('/', async ctx => {
  const koders = await koder.getAll()

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
  const token = await jwt.sign({ id: koderSignedIn._id })
  
  console.warn({ email, password })
  ctx.resolve({
    message: `${koderSignedIn.email} Signed in successfully`,
    payload: {
      token
    }
  })
})


module.exports = router
