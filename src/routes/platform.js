const Router = require('koa-router')

const router = new Router({
  prefix: '/platform'
})

router.post('/calculator', async ctx => {
  console.log(ctx.request.body)
  ctx.resolve({
    message: 'success'
  })
})

module.exports = router
