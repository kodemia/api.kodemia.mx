const Router = require('koa-router')

const Event = require('../usecases/events')

const auth = require('../middlewares/auth')

const router = new Router({
  prefix: '/events'
})

router.get('/', auth(), async ctx => {
  const events = await Event.getAll()

  ctx.resolve({
    message: 'Events list',
    payload: { events }
  })
})

router.get('/:id', auth(), async ctx => {
  const { id } = ctx.params
  const events = await Event.getById(id)

  ctx.resolve({
    message: 'Event retrieved',
    payload: { events }
  })
})

router.post('/', auth(), async ctx => {
  const { name, date } = ctx.request.body
  const event = await Event.create({ name, date })

  ctx.resolve({
    message: 'Event created',
    payload: { event }
  })
})

router.patch('/:id', auth(), async ctx => {
  const { id } = ctx.params
  const event = await Event.updateById(id, ctx.body)

  ctx.resolve({
    message: 'Event updated',
    payload: { event }
  })
})

router.delete('/:id', auth(), async ctx => {
  const { id } = ctx.params
  const event = await Event.deleteById(id)

  ctx.resolve({
    message: 'Event deleted',
    payload: { event }
  })
})

module.exports = router
