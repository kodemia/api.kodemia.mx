
const _ = require('lodash')
const jwt = require('../lib/jwt')

module.exports = (authRoles = []) => async (ctx, next) => {
  if ('authorization' in ctx.request.headers) {
    try {
      const token = _.get(ctx, 'request.headers.authorization')
      let jwtDecoded = await jwt.verify(ctx.request.headers.authorization)
      if (jwtDecoded) return next()
      ctx.throw(401, 'Unauthorized')
    } catch (error) {
      console.error(error)
      ctx.throw(401, 'Invalid token')
    }
  } else {
    ctx.throw(401, 'Unauthorized')
  }
}
