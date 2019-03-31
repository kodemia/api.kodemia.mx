
const mongoose = require('mongoose')

const { Schema } = mongoose

const classSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date
  },
  description: {
    type: String,
    trim: true
  },
  thumbnail: {
    type: String,
    trim: true
  },
  playbackId: {
    type: String,
    trim: true
  }
})

const model = mongoose.model('Class', classSchema)

module.exports = {
  model,
  schema: classSchema
}
