
const Handlebars = require('handlebars')
const utils = require('./utils')

Handlebars.registerHelper('numberToTextInPesos', value => {
  return utils.convertNumberToTextInSpanish(value)
})

module.exports = Handlebars
