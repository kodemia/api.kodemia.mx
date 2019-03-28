const jwt = require('jsonwebtoken')

const secretWord = process.env.JWT_SECRET || 'superSecretWord'
const ttl = process.env.JWT_EXPIRATION || '7d'

module.exports = {
  sign (payload, secret = secretWord) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, { expiresIn: ttl }, function (error, token) {
        if (error) return reject(error)
        resolve(token)
      })
    })
  },

  verify (token, secret = secretWord) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, function (error, decoded) {
        if (error) return reject(error)
        resolve(decoded)
      })
    })
  }
}