
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

module.exports = {
  removeFalsyEntries
}
