
const createError = require('http-errors')

const Koder = require('../models/koder').model
const Mentor = require('../models/mentor').model

const bcrypt = require('../lib/bcrypt')
const jwt = require('../lib/jwt')

async function signIn (email, password) {
  const koder = await Koder.findOne({ email }).select('+password')
  const mentor = await Mentor.findOne({ email }).select('+password')
  const user = koder || mentor

  if (!user) throw createError(401, 'Invalid data')

  const { password: hash } = user
  console.log('password: ', password)
  console.log('hash: ', hash)
  const isValidPassword = await bcrypt.compare(password, hash)
  if (!isValidPassword) throw createError(401, 'Invalid data')

  const token = await jwt.sign({
    id: user._id,
    isMentor: !!mentor
  })

  return token
}

module.exports = {
  signIn
}
