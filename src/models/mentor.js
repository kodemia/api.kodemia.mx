
const mongoose = require('mongoose')
const _ = require('lodash')

const { Schema } = mongoose

const nonPublicProperties = [ 'password' ]

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
    trim: true,
    select: false
  },
  phone: {
    type: String,
    trim: true,
    match: /[0-9]{10}/
  }
})

mentorSchema.method({
  toPublic: function () {
    const object = this.toObject()
    return _.omit(object, nonPublicProperties)
  }
})

const model = mongoose.model('Mentor', mentorSchema)

module.exports = {
  model,
  schema: mentorSchema
}
