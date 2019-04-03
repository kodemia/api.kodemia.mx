require('dotenv').config()
const db = require('./src/lib/db')

const server = require('./src/server')
const port = process.env.PORT || 8080

server.listen(port, function () {
  console.info(`Server running in: http://localhost:${port}`)
  db.connect()
    .then(() => console.info('< MONGO CONNECTED >'))
    .catch(error => console.error('ERROR CONN: ', error))
})
