var test = require('tape')
var Provider = require('../')
var Agent = require('../lib/agent')
var opts = { host: 'http://localhost:8080/RPC2' }

if (process) {
  process.on('unhandledRejection', function (reason, p) {
    console.log(p)
  })
}

test('getTorrents retrieves active torrents', function (t) {
  t.plan(2)
  var agent = new Agent(opts)

  agent.getTorrents().then(function (res) {
    t.ok(typeof res !== null && typeof res === 'object', 'response is object')
    t.ok(Object.keys(res).length, 'object is not empty')
    console.log(res)
  })
})
