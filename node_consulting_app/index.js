const { fork } = require('child_process')

const process = [
  fork('./app', ['3001']),
  fork('./app', ['3082']),
  fork('./app', ['3083'])
]

//ports : 3002, 3003  were in use during testing

console.log('forked ${processes.length} processes');
