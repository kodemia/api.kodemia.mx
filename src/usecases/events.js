
const Event = require('../models/event').model

function getAll () {
  return Event.find()
}

function getById (id) {
  return Event.findById(id)
}

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
  getAll,
  getById,
  create,
  deleteById,
  updateById
}
