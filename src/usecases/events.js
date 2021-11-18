
const Event = require('../models/event').model

function create ({ name, date }) {
  return Event.create({ name, date })
}

function deleteById (id) {
  return Event.findByIdAndRemove(id)
}

function updateById (id, newEventData) {
  return Event.findByIdAndUpdate(id, newEventData)
}

module.exports = {
  create,
  deleteById,
  updateById
}
