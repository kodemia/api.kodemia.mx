const Router = require('koa-router')
const _ = require('lodash')

const auth = require('../middlewares/auth')

const klass = require('../usecases/class')

const router = new Router({
  prefix: '/classes'
})

router.post('/', auth(), async ctx => {
  const newKlass = await klass.create(ctx.request.body)

  ctx.resolve({
    message: 'Class created successfully',
    payload: {
      class: newKlass
    }
  })
})

router.get('/', auth(['koder']), async ctx => {
  const user = _.get(ctx, 'state.user', {})
  const allClasses = await klass.getListByUser(user)
  ctx.resolve({
    message: 'Classes list',
    payload: {
      classes: allClasses
    }
  })
})

router.get('/upload/last', async ctx => {
  const classesUpload = klass.uploadLastClasses()
  ctx.resolve({
    payload: {
      classes: classesUpload
    }
  })
})

module.exports = router
