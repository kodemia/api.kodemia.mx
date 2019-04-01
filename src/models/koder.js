
const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types } = Schema

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
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    match: /[0-9]{10,12}/
  },
  generation: {
    type: Types.ObjectId,
    ref: 'Generation'
  }
})

const model = mongoose.model('Koder', koderSchema)

module.exports = {
  model,
  schema: koderSchema
}
