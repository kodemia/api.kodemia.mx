require('dotenv').config()
const db = require('./src/lib/db')

const server = require('./src/server')
const port = process.env.PORT || 8080

server.listen(port, function () {
  console.log(`Server running in: http://localhost:${port}`)
  db.connect()
    .then(() => console.log('< MONGO CONNECTED >'))
    .catch(error => console.log('ERROR CONN: ', error))
})
