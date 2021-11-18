
const createError = require('http-errors')
const dayjs = require('dayjs')

const Invitation = require('../models/invitation').model
const Koder = require('../models/koder').model
const Event = require('../models/event').model

async function create (eventId, koderId) {
  const koderExists = await Koder.findById(koderId)
  const eventExists = await Event.findById(eventId)

  if (!koderExists) createError(404, `Koder ${koderId} does not exists`)
  if (!eventExists) createError(404, `Event ${eventId} does not exists`)

  return Invitation.create({
    koder: koderId,
    event: eventId
  })
}

function deleteById (id) {
  return Invitation.findByIdAndDelete(id)
}

async function checkIn (id) {
  return Invitation.findByIdAndUpdate(id, {
    checkIn: dayjs()
  })
}

module.exports = {
  create,
  deleteById,
  checkIn
}
