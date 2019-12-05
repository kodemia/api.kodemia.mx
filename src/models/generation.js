
const mongoose = require('mongoose')
const moment = require('moment-timezone')

const { Schema } = mongoose

const generationSchema = new Schema({
  number: {
    type: Number,
    min: 1,
    required: true
  },
  type: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    enum: [
      'black',
      'white'
    ]
  },
  startDate: {
    type: Date,
    default: moment()
  },
  endDate: {
    type: Date,
    default: moment().add(19, 'weeks')
  }
})

const model = mongoose.model('Generation', generationSchema)

module.exports = {
  model,
  schema: generationSchema
}
