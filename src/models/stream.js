
const mongoose = require('mongoose')

const { Schema } = mongoose

const streamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  generation: {
    type: Types.ObjectId,
    ref: 'Generation'
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    trim: true,
    required: true
  },
  muxData: {},
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isLive: {
    type: Boolean,
    default: false
  }
})

const model = mongoose.model('Stream', streamSchema)

module.exports = {
  model,
  schema: streamSchema
}
