const Router = require('koa-router')

const generation = require('../usecases/generation')

const router = new Router({
  prefix: '/generations'
})

router.post('/', async ctx => {
  const {
    number,
    type,
    startDate,
    endDate
  } = ctx.request.body

  const newGeneration = await generation.create({
    number,
    type,
    startDate,
    endDate
  })

  ctx.resolve({
    message: 'Generation created successfully',
    payload: {
      generation: newGeneration
    }
  })

})

router.get('/', async ctx => {
  const allGenerations = await generation.getAll()
  ctx.resolve({
    message: 'Generations list',
    payload: {
      generations: allGenerations
    }
  })
})


module.exports = router
