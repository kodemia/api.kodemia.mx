const Router = require('koa-router')
const _ = require('lodash')

const auth = require('../middlewares/auth')

const stream = require('../usecases/stream')

const router = new Router({
  prefix: '/streams'
})

router.post('/', auth(), async ctx => {
  const {
    name,
    generation,
    title,
    url,
    muxData,
    endDate,
    isActive,
    isLive
  } = ctx.request.body

  const newStream = await stream.create({
    name,
    generation,
    title,
    url,
    muxData,
    endDate,
    isActive,
    isLive
  })

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
    ? await stream.getLast()
    : await stream.getByGenerationId(generationId)

  ctx.resolve({
    message: 'Stream retrieved successfully',
    payload: {
      stream: streamData
    }
  })
})

module.exports = router
