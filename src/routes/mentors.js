const Router = require('koa-router')

const mentor = require('../usecases/mentor')

const router = new Router({
  prefix: '/mentors'
})

router.post('/', async ctx => {
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

router.get('/', async ctx => {
  const allMentors = await mentor.getAll()

  const cleanMentors = allMentors.map(mentor => {
    const { password, ...cleanMentor } = mentor.toObject()
    return cleanMentor
  })

  ctx.resolve({
    message: 'Mentors list',
    payload: {
      mentors: cleanMentors
    }
  })
})

module.exports = router
