const Router = require('koa-router')

const router = new Router({
  prefix: '/koders'
})

router.get('/', async (ctx) => {

  ctx.resolve({
    message: `Root koders router`
  })

})

router.post('/login', async ctx => {
  const { email, password } = ctx.request.body

  if (!email) throw ctx.throw(400, 'Email is required')
  if (!password) throw ctx.throw(400, 'Password is required')

  
  
  console.warn({ email, password })
  ctx.resolve({
    message: 'login'
  })
})


module.exports = router
