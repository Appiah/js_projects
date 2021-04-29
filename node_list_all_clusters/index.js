const http = require('http')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length

if(cluster.isMaster){
  console.log('this is the master process: ', process.pid)
  /*cluster.fork()
  cluster.fork()
  cluster.fork()*/
  for(let i=0; i<numCPUs; i++){
    cluster.fork()
  }
}else{
  console.log('this is the worker process: ', process.pid)
  http.createServer((req, res) => {
    const message = `worker ${process.pid}`
    console.log(message)
    res.end(message)
  }).listen(3084)
}

//install loadtest
//$ sudo npm install loadtest -g
//remember to update npm before

//command to test the app :
//$ loadtest -n 300 http://localhost:3000

/* Options for loadtest

-n, --maxRequests <ARG1>      	Number of requests to perform
  -c, --concurrency <ARG1>      	Number of requests to make
  -t, --maxSeconds <ARG1>       	Max time in seconds to wait for responses
  -d, --timeout <ARG1>          	Timeout for each request in milliseconds
  -T, --contentType <ARG1>      	MIME type for the body
  -C, --cookies <ARG1>          	Send a cookie as name=value (multiple)
  -H, --headers <ARG1>          	Send a header as header:value (multiple)
  -P, --postBody <ARG1>         	Send string as POST body
  -p, --postFile <ARG1>         	Send the contents of the file as POST body
  -A, --patchBody <ARG1>        	Send string as PATCH body
  -a, --patchFile <ARG1>        	Send the contents of the file as PATCH body
  --data <ARG1>                 	Send data POST body
  -m, --method <ARG1>           	method to url
  -u, --putFile <ARG1>          	Send the contents of the file as PUT body
  -R, --requestGenerator <ARG1> 	JS module with a custom request generator function
  -r, --recover                 	Do not exit on socket receive errors (default)
  -s, --secureProtocol <ARG1>   	TLS/SSL secure protocol method to use
  -k, --keepalive               	Use a keep-alive http agent
  -V, --version                 	Show version number and exit
  --proxy <ARG1>                	Use a proxy for requests e.g. http://localhost:8080
  --rps <ARG1>                  	Specify the requests per second for each client
  --agent                       	Use a keep-alive http agent (deprecated)
  --index <ARG1>                	Replace the value of given arg with an index in the URL
  --quiet                       	Do not log any messages
  --debug                       	Show debug messages
  --insecure                    	Allow self-signed certificates over https
  --key <ARG1>                  	The client key to use
  --cert <ARG1>                 	The client certificate to use

*/
