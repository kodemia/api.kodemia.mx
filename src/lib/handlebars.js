
const Handlebars = require('handlebars')
const utils = require('./utils')

Handlebars.registerHelper({
  numberToTextInPesos: value => {
    return utils.convertNumberToTextInSpanish(value)
  },
  formatCurrency: value => {
    return utils.formatCurrency(value)
  }
})

module.exports = Handlebars
