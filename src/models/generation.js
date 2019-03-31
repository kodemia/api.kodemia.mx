
const mongoose = require('mongoose')

const { Schema } = mongoose

const generationSchema = new Schema({
  number: {
    type: Number,
    min: 1,
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
})

const model = mongoose.model('Class', generationSchema)

module.exports = {
  model,
  schema: generationSchema
}
