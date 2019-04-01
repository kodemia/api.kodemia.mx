
const mongoose = require('mongoose')

const { Schema } = mongoose

const mentorSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String, 
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  }, 
  password: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    match: /[0-9]{10}/
  }
})

const model = mongoose.model('Mentor', mentorSchema)

module.exports = {
  model,
  schema: mentorSchema
}
