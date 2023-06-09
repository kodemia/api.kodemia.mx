const mongoose = require('mongoose')

const DB_USER = process.env.DB_USER || ''
const DB_PASSWORD = process.env.DB_PASSWORD || ''
const DB_NAME = process.env.DB_NAME || ''
const DB_HOST = process.env.DB_HOST || ''
const CONN_STRING = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true`

async function connect ({ logSuccess = true }) {
  if (mongoose.connection.readyState !== mongoose.STATES.connected) {
    return mongoose
      .connect(CONN_STRING)
      .then(() => {
        if (logSuccess) console.log('- DB Connection Open -')
        return mongoose
      })
  }
  return mongoose
}

module.exports = { connect }
