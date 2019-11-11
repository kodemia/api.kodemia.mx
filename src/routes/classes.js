const Router = require('koa-router')

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

router.get('/', async ctx => {
  const allClasses = await klass.getAll()
  ctx.resolve({
    message: 'Classes list',
    payload: {
      classes: allClasses
    }
  })
})

module.exports = router
