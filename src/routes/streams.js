const Router = require('koa-router')
const _ = require('lodash')

const auth = require('../middlewares/auth')

const stream = require('../usecases/stream')

const router = new Router({
  prefix: '/streams'
})

router.post('/', async ctx => {
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

router.get('/', async ctx => {
  const allStreams = await stream.getAll()
  ctx.resolve({
    message: 'Streams list',
    payload: {
      streams: allStreams
    }
  })
})

router.get('/url', auth(), async ctx => {
  const generationId = _.get(ctx, 'state.user.generation', '')

  const streamData = await stream.getByGenerationId(generationId)
  ctx.resolve({
    message: 'Stream retrieved successfuly',
    payload: {
      stream: streamData
    }
  })
})

module.exports = router
