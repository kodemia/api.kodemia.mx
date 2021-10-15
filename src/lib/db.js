const mongoose = require('mongoose')

const DB_USER = process.env.DB_USER || ''
const DB_PASSWORD = process.env.DB_PASSWORD || ''
const DB_NAME = process.env.DB_NAME || ''
const CONN_STRING = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@charles-mongo-cluster-ekbll.mongodb.net/${DB_NAME}?retryWrites=true`

async function connect () {
  if (mongoose.connection.readyState !== mongoose.STATES.connected) {
    return mongoose
      .connect(CONN_STRING)
      .then(() => {
        console.log('- DB Connection Open -')
        return mongoose
      })
  }
  return mongoose
}

module.exports = { connect }
