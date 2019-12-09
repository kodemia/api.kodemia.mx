const Router = require('koa-router')
const _ = require('lodash')

const auth = require('../middlewares/auth')

const stream = require('../usecases/stream')

const router = new Router({
  prefix: '/streams'
})

router.post('/', auth(), async ctx => {
  const newStream = await stream.create(ctx.request.body)

  ctx.resolve({
    message: 'Stream created successfully',
    payload: {
      stream: newStream
    }
  })
})

router.get('/', auth(['koder']), async ctx => {
  const isMentor = _.get(ctx, 'state.user.isMentor', false)
  const generationId = _.get(ctx, 'state.user.generation', '')

  const streamData = isMentor
    ? await stream.getAll()
    : await stream.getByGenerationId(generationId)

  ctx.resolve({
    message: 'Stream retrieved successfully',
    payload: {
      stream: streamData
    }
  })
})

module.exports = router
