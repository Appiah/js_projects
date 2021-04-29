const http = require('http')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length

const allowNewWorkerCreation = true

if(cluster.isMaster){
  console.log('this is the master process: ', process.pid)
  /*cluster.fork()
  cluster.fork()
  cluster.fork()*/
  for(let i=0; i<numCPUs; i++){
    cluster.fork()
  }

  cluster.on('exit', worker => {
    console.log(`worker process ${process.pid} had died`)
    if(allowNewWorkerCreation){
      console.log(`starting new worker`)
      cluster.fork()
    }else{
      console.log(`only ${Object.keys(cluster.workers).length} remaining`)
      //When a process is killed, the current running instance or session being run
      //the user is passed on to another process till there is no more live process
    }
  })

}else{
  console.log('started a worker at  process: ', process.pid)
  http.createServer((req, res) => {
    //const message = `worker ${process.pid}`
    //console.log(message)
    //res.end(message)

    res.end(`process: ${process.pid}`)
    if(req.url === '/kill'){
      process.exit()
    }else if(req.url === '/'){
      console.log(`serving from ${process.pid}`)
    }
    else{
      console.log(`working on request ${process.pid}...`)
    }

  }).listen(3085)
}
