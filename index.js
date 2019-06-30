require('dotenv').config()
const db = require('./src/lib/db')

const server = require('./src/server')
const port = process.env.PORT || 8080

db.connect()
  .then(() => {
    console.info('- DB connected')
    server.listen(port, console.info(`Server listening on http://localhost:${port}`))
  })
  .catch(error => console.error('DB ERROR CONN: ', error))
