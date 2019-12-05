
const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types } = Schema

const classSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  thumbnail: {
    type: String,
    trim: true
  },
  playbackId: {
    type: String,
    trim: true,
    required: () => !this.vimeoId
  },
  vimeoId: {
    type: String,
    required: () => !this.playbackId
  },
  mentor: {
    type: Types.ObjectId,
    ref: 'Mentor'
  },
  generation: {
    type: Types.ObjectId,
    ref: 'Generation'
  }
})

const model = mongoose.model('Class', classSchema)

module.exports = {
  model,
  schema: classSchema
}
