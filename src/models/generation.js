
const mongoose = require('mongoose')

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
    type: Date
  },
  endDate: {
    type: Date
  }
})

const model = mongoose.model('Generation', generationSchema)

module.exports = {
  model,
  schema: generationSchema
}
