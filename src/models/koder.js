
const mongoose = require('mongoose')

const { Schema } = mongoose

const koderSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String, 
    required: true,
    trim: true,
    lowercase: true
  }, 
  password: {
    type: String,
    required: true,
    trim: true
  }
})

const model = mongoose.model('Koder', koderSchema)

module.exports = {
  model,
  schema: koderSchema
}
