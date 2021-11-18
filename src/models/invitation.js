
const { Schema, model } = require('mongoose')

const { Types } = Schema

const invitationSchema = new Schema({
  koder: {
    type: Types.ObjectId,
    ref: 'Koder'
  },
  event: {
    type: Types.ObjectId,
    ref: 'Event'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  checkIn: {
    type: Date,
    default: null
  }
})

module.exports = {
  model: model('Invitation', invitationSchema),
  schema: invitationSchema
}
