
const createError = require('http-errors')
const dayjs = require('dayjs')

const Invitation = require('../models/invitation').model
const Koder = require('../models/koder').model
const Event = require('../models/event').model

function getAll () {
  return Invitation.find()
    .populate('koder')
    .populate('event')
}

function getById (id) {
  return Invitation.findById(id)
    .populate('koder')
    .populate('event')
}

function getByEventId (eventId) {
  return Invitation.find({ event: eventId })
    .populate('koder')
    .populate('event')
}

function getByKoderId (koderId) {
  return Invitation.find({ koder: koderId })
    .populate('koder')
    .populate('event')
}

async function create (eventId, koderId) {
  const koder = await Koder.findById(koderId)
  const event = await Event.findById(eventId)

  if (!koder) createError(404, `Koder ${koderId} does not exists`)
  if (!event) createError(404, `Event ${eventId} does not exists`)

  const invitation = await Invitation.findOne({
    koder: koder._id,
    event: event._id
  }).populate('koder')
    .populate('event')

  if (invitation) return invitation

  return Invitation.create({ koder: koder._id, event: event._id })
}

async function deleteById (id) {
  const invitation = await Invitation.findById(id)

  if (!invitation) throw createError(404, 'Invitation not found')

  return invitation.delete()
}

async function checkIn (id) {
  const invitation = await Invitation.findById(id)
    .populate('koder')
    .populate('event')

  if (!invitation) throw createError(404, 'Invitation not found')

  if (invitation.checkIn) return invitation

  return Invitation.findByIdAndUpdate(id, {
    checkIn: dayjs()
  })
}

module.exports = {
  getAll,
  getById,
  getByEventId,
  getByKoderId,
  create,
  deleteById,
  checkIn
}
