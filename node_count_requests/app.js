const http = require('http')

let rquests = 0

const server = http.createServer((req, res) => {
  if(req.url === '/'){
    requests++
    console.log(`${process.pid}: ${requests}`)
    res.end(JSON.stringify(requests))
  }
})

server.listen(3087)
console.log(`counting requests`)


//when this is run in more instances, each instance creates is requests counts and stores then
//leading to multiple values for requests and delay in rendering.

//so we improve it with databases in "node_count_requests_v2" by applying databases to it
