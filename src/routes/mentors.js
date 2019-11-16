const Router = require('koa-router')

const auth = require('../middlewares/auth')

const mentor = require('../usecases/mentor')

const router = new Router({
  prefix: '/mentors'
})

router.post('/', auth(), async ctx => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone
  } = ctx.request.body

  const newMentor = await mentor.create({
    firstName,
    lastName,
    email,
    password,
    phone
  })

  ctx.resolve({
    message: 'Mentor created successfully',
    payload: {
      mentor: newMentor
    }
  })
})

router.get('/', auth(), async ctx => {
  const mentors = await mentor.getAll()

  ctx.resolve({
    message: 'Mentors list',
    payload: { mentors }
  })
})

router.patch('/password', async ctx => {
  const { email, password } = ctx.request.body

  if (!email) throw ctx.throw(400, 'Email is required')
  if (!password) throw ctx.throw(400, 'Password is required')

  await mentor.resetPassword(email, password)

  ctx.resolve({
    message: `Password updated for ${email}`
  })
})

module.exports = router
