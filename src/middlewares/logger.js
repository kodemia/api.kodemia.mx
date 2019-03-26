
function filterBody (body) {
  let newBody = typeof body === 'string' ? JSON.parse(body) : body
  let bodyToClean = { ...newBody }
  if ('password' in bodyToClean) bodyToClean.password = '<password>'
  if ('token' in bodyToClean) bodyToClean.token = '<token>'
  return typeof body === 'string' ? body : JSON.stringify(bodyToClean)
}

module.exports = async (ctx, next) => {
  try {
    let start = Date.now()
    await next()
    const ms = Date.now() - start
    console.log(`${ctx.method} ${ctx.url} -> ${ctx.status} - ${ms}ms, query: ${JSON.stringify(ctx.query)}, ${(ctx.method !== 'GET' || ctx.method !== 'DELETE') && `body: ${filterBody(ctx.request.body)},`} at ${(new Date()).toISOString()}`)
  } catch (error) {
    console.log(`${ctx.method} ${ctx.url} -> ${ctx.status}, query: ${JSON.stringify(ctx.query)}, body: ${filterBody(ctx.request.body)}, at ${(new Date()).toISOString()}`)
    // console.error(error)
    throw error
  }
}
