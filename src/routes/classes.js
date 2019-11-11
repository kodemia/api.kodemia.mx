const Router = require('koa-router')
const _ = require('lodash')

const auth = require('../middlewares/auth')

const klass = require('../usecases/class')

const router = new Router({
  prefix: '/classes'
})

router.post('/', async ctx => {
  const {
    title,
    date,
    description,
    thumbnail,
    playbackId,
    mentor,
    generation = {
      type: 'white',
      number: 0
    }
  } = ctx.request.body

  const newKlass = await klass.create({
    title,
    date,
    description,
    thumbnail,
    playbackId,
    mentor,
    generation
  })

  ctx.resolve({
    message: 'Class created successfully',
    payload: {
      class: newKlass
    }
  })
})

router.get('/', auth(), async ctx => {
  const user = _.get(ctx, 'state.user', {})
  console.log('user: ', user)
  const allClasses = await klass.getList(user)
  ctx.resolve({
    message: 'Classes list',
    payload: {
      classes: allClasses
    }
  })
})

module.exports = router
