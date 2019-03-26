
const mongoose = require('mongoose')

const { Schema } = mongoose

const koderSchema = new Schema({})

const model = mongoose.model('Koder', koderSchema)

module.exports = {
  model,
  schema: koderSchema
}
