const http = require('http')
const port = parseInt(process.argv[2] || '3000')

const options = [
  "Go for it!",
  "Maybe Sleep on it",
  "Do some more research",
  "I don't know",
  "I wouldn't"
]

const server = http.createServer((req, res) => {
  const randomIndex = Math.floor(Math.random() * options.length)
  const payload = JSON.stringify({
    port,
    processID: process.pid,
    advice: options[randomIndex]
  })

  res.writeHead(200, {'Content-Type' : 'application/json'})
  res.end(payload)
} )

server.listen(port)
console.log('advice service running on port ${port}')
