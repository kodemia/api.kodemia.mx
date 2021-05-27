
const mongoose = require('mongoose')
const _ = require('lodash')

const { Schema } = mongoose
const { Types } = Schema

const nonPublicProperties = ['password']

const koderSchema = new Schema({
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
    index: true,
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
    match: /[0-9]{10,12}/
  },
  generation: {
    type: Types.ObjectId,
    ref: 'Generation'
  },
  isActive: {
    type: Boolean,
    default: true
  }
})

koderSchema.method({
  toPublic: function () {
    const object = this.toObject()
    return _.omit(object, nonPublicProperties)
  }
})

const model = mongoose.model('Koder', koderSchema)

module.exports = {
  model,
  schema: koderSchema
}
