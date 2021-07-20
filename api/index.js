
// Entry point for VERCEL
require('dotenv').config()
const db = require('../src/lib/db')
const server = require('../src/server')

db.connect()
  .then(() => console.log('- DB Connected'))

module.exports = server
