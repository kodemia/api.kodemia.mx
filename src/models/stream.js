
const mongoose = require('mongoose')
const moment = require('moment-timezone')

const { Schema } = mongoose
const { Types } = Schema

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
  vimeoEventId: {
    type: String
  },
  startDate: {
    type: Date,
    default: moment()
  },
  endDate: {
    type: moment().add(20, 'weeks')
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
