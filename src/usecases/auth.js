
const createError = require('http-errors')

const Koder = require('../models/koder').model
const Mentor = require('../models/mentor').model

const bcrypt = require('../lib/bcrypt')
const jwt = require('../lib/jwt')

async function signIn (email, password) {
  const koder = await Koder.findOne({ email }).select('+password')
  const mentor = await Mentor.findOne({ email }).select('+password')
  const user = mentor || koder

  if (!user) throw createError(401, 'Invalid data')

  const { password: hash } = user
  const isValidPassword = await bcrypt.compare(password, hash)
  if (!isValidPassword) throw createError(401, 'Invalid data')

  const isExpired = koder
    ? koder.isExpired()
    : false

  if (isExpired) throw createError(412, 'Account expired')

  const token = await jwt.sign({
    id: user._id,
    isMentor: !!mentor,
    isExpired,
    isTemporal: !!user.isTemporal
  })

  return token
}

module.exports = {
  signIn
}
