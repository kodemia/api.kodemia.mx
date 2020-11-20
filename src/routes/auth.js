const Router = require('koa-router')

const auth = require('../usecases/auth')
const authMiddleware = require('../middlewares/auth')
const db = require('../lib/db')

const router = new Router({
  prefix: '/auth'
})

router.post('/login', async ctx => {
  const { email, password } = ctx.request.body

  if (!email) throw ctx.throw(400, 'Email is required')
  if (!password) throw ctx.throw(400, 'Password is required')

  const token = await auth.signIn(email, password)

  ctx.resolve({
    message: `${email} Signed in successfully`,
    payload: {
      token
    }
  })
})

// TODO: Delete this
router.get('/', authMiddleware(), async ctx => {
  ctx.resolve({
    message: 'get auth',
    data: {
      string: db.CONN_STRING
    }
  })
})

module.exports = router
