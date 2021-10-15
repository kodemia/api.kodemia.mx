
const Sentry = require('@sentry/node')

const db = require('../lib/db')

async function connectDatabase (ctx, next) {
  try {
    const mongoose = await db.connect()
    await next()
    await mongoose.connection.close()
    console.log('- DB Connection Closed -')
  } catch (error) {
    Sentry.captureException(error)
    console.error('- DB Connection Error -')
    ctx.throw(500, 'DB connection error')
  }
}

module.exports = connectDatabase
