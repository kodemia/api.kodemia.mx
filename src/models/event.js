
const { Schema, model } = require('mongoose')

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: null,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = {
  model: model('Event', eventSchema),
  schema: eventSchema
}
