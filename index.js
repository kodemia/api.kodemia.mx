require('dotenv').config()

const server = require('./src/server')
const port = process.env.PORT || 8080

server.listen(port, () =>
  console.info(`Server listening on http://localhost:${port}`)
)
