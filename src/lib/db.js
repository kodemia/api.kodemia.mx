const mongoose = require('mongoose')

const DB_USER = process.env.DB_USER || 'kodemiadmin'
const DB_PASSWORD = process.env.DB_PASSWORD || ''
const DB_NAME = process.env.DB_NAME || 'kodemia'
const CONN_STRING = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@charles-mongo-cluster-ekbll.mongodb.net/${DB_NAME}?retryWrites=true`

const connect = () => new Promise((resolve, reject) => {
  mongoose.connect(CONN_STRING, {
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    useNewUrlParser: true
  })

  const db = mongoose.connection

  db.on('error', error => {
    console.error('[DB ERROR]: ')
    return reject(error)
  })

  db.once('open', () => {
    return resolve(mongoose)
  })
})

module.exports = { connect }
