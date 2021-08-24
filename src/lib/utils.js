
const conversor = require('conversor-numero-a-letras-es-ar')

/**
 *
 * @param {Object} object - any object
 * removes falsy entries in an object
 */
function removeFalsyEntries (object = {}) {
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
function convertNumberToTextInSpanish (number) {
  const ConverterClass = conversor.conversorNumerosALetras
  const myConverter = new ConverterClass()
  const numberWord = myConverter.convertToText(number)
  const capitalLetter = numberWord.slice(0, 1).toUpperCase()
  const restOfLetters = numberWord.slice(1)

  return `${capitalLetter}${restOfLetters}`
}

/**
 *@param {number} number
 *@param {boolean} withCurrencySign
 *@returns the number formatted as currency
 *
*/
function formatCurrency (number, withCurrencySign = true) {
  const formatter = new Intl.NumberFormat('en-MX', {})
  return withCurrencySign
    ? `$ ${formatter.format(number)}`
    : formatter.format(number)
}

module.exports = {
  removeFalsyEntries,
  convertNumberToTextInSpanish,
  formatCurrency
}
