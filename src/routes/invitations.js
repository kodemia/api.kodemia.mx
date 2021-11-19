const Router = require('koa-router')

const Invitation = require('../usecases/invitations')

const auth = require('../middlewares/auth')

const router = new Router({
  prefix: '/invitations'
})

router.get('/', auth(), async ctx => {
  const invitations = await Invitation.getAll()

  ctx.resolve({
    message: 'Invitations list',
    payload: { invitations }
  })
})

router.get('/:id', async ctx => {
  const { id } = ctx.params
  const invitations = await Invitation.getById(id)

  ctx.resolve({
    message: 'Invitation retrieved',
    payload: { invitations }
  })
})

router.post('/:id/check-in', auth(), async ctx => {
  const { id } = ctx.params
  const invitation = await Invitation.checkIn(id)

  ctx.resolve({
    message: 'Invitation checked in',
    payload: { invitation }
  })
})

router.get('/events/:eventId', async ctx => {
  const { eventId } = ctx.params
  const invitations = await Invitation.getByEventId(eventId)

  ctx.resolve({
    message: 'Event invitations retrieved',
    payload: { invitations }
  })
})

router.get('/koders/:koderId', auth(), async ctx => {
  const { koderId } = ctx.params
  const invitations = await Invitation.getByKoderId(koderId)

  ctx.resolve({
    message: 'Koder invitations retrieved',
    payload: { invitations }
  })
})

router.post('/', auth(), async ctx => {
  const { koder, event } = ctx.request.body
  const invitation = await Invitation.create(event, koder)

  ctx.resolve({
    message: 'Invitation created',
    payload: { invitation }
  })
})

router.delete('/:id', auth(), async ctx => {
  const { id } = ctx.params
  const invitation = await Invitation.deleteById(id)

  ctx.resolve({
    message: 'Invitation deleted',
    payload: { invitation }
  })
})

module.exports = router
