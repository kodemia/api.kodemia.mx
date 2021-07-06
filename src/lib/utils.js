
const conversor = require('conversor-numero-a-letras-es-ar')

/**
 *
 * @param {Object} object - any object
 * removes falsy entries in an object
 */
function removeFalsyEntries(object = {}) {
  return Object.entries(object)
    .reduce((objectData, [key, value]) => {
      return !value
        ? objectData
        : { ...objectData, [key]: value }
    }, {})
}

/**
 *
 * @param {number} number
 * @returns string representation of the number in spanish words
 */
function convertNumberToTextInSpanish(number) {
  const ConverterClass = conversor.conversorNumerosALetras
  const myConverter = new ConverterClass()
  const numberWord = myConverter.convertToText(number)
  const capitalLetter = numberWord.slice(0, 1).toUpperCase()
  const restOfLetters = numberWord.slice(1)

  return `${capitalLetter}${restOfLetters}`
}

/**
 *@param {number} number
 * format the number in the correct currency
 *
*/
function formatCurrency(value) {
  var numberToString = value.toString()
  if (numberToString.length === 4) {
    const thousand = numberToString.slice(0, 1)
    const restOfValues = numberToString.slice(1)
    return `$${thousand},${restOfValues}.00`
  }
  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  })
  return formatter.format(value)

}

module.exports = {
  removeFalsyEntries,
  convertNumberToTextInSpanish,
  formatCurrency
}
