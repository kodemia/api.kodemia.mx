const mongoose = require('mongoose')

const DB_USER = process.env.DB_USER || ''
const DB_PASSWORD = process.env.DB_PASSWORD || ''
const DB_NAME = process.env.DB_NAME || ''
const CONN_STRING = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@charles-mongo-cluster-ekbll.mongodb.net/${DB_NAME}?retryWrites=true`

function connect () {
  return mongoose.connect(CONN_STRING, {
    // keepAlive: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
}

module.exports = { connect }
