
const mongoose = require('mongoose')
const _ = require('lodash')
const dayjs = require('dayjs')

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
    required: () => !!this.generation,
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
    ref: 'Generation',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isTemporal: {
    type: Boolean,
    default: false
  },
  expirationDate: {
    type: Date,
    default: function () {
      return this.isTemporal
        ? dayjs().add(4, 'days')
        : dayjs().add(100, 'year')
    }
  },
  deactivationReason: {
    type: String,
    enum: ['unpaid', 'unresponsive', 'expelled', 'desertion'],
    required: () => this.isActive === false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

koderSchema.method({
  toPublic: function () {
    const object = this.toObject()
    return _.omit(object, nonPublicProperties)
  },
  isExpired: function () {
    if (!this.expirationDate) return false

    const today = dayjs()
    const expirationDate = dayjs(this.expirationDate)

    return today.isAfter(expirationDate)
  }
})

const model = mongoose.model('Koder', koderSchema)

module.exports = {
  model,
  schema: koderSchema
}
