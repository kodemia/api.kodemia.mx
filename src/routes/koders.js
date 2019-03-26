const Router = require('koa-router')

const router = new Router({
  prefix: '/koders'
})

router.get('/', async (ctx) => {

  ctx.resolve({
    message: `Root koders router`
  })
})


module.exports = router
