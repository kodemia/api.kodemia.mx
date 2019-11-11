
const _ = require('lodash')
const assert = require('http-assert')

const jwt = require('../lib/jwt')

const koder = require('../usecases/koder')
const mentor = require('../usecases/mentor')

module.exports = (authRoles = []) => async (ctx, next) => {
  if ('authorization' in ctx.request.headers) {
    try {
      const token = _.get(ctx, 'request.headers.authorization')
      assert(token, 401, 'Empty Authorization header')

      let tokenDecoded = await jwt.verify(token)
      const { id, isMentor } = tokenDecoded

      if (!authRoles.includes('koder') && !isMentor) ctx.throw(401, 'Unauthorized role')

      let user = isMentor
        ? await mentor.getById(id)
        : await koder.getById(id)
      user = user.toObject({ getters: true })

      assert(user, 401, 'User not found')
      _.set(ctx, 'state.user', { isMentor, ...user })

      if (tokenDecoded) return next()
      ctx.throw(401, 'Unauthorized')
    } catch (error) {
      console.error(error)
      ctx.throw(401, error.message)
    }
  } else {
    ctx.throw(401, 'No Authorization header present')
  }
}
