var Client = require('../lib/client')({
  host: 'http://localhost:8080/RPC2'
})

Client.getStats().catch(err => console.error(err)).then(res => console.log(res))
