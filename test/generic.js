var test = require('tape')
var Provider = require('../')
var Agent = require('../lib/agent')
var opts = { host: 'http://localhost:8080/RPC2' }

if (process) {
  process.on('unhandledRejection', function (reason, p) {
    console.log(p)
  })
}

test('getStats: returns client stats', function (t) {
  var agent = new Agent(opts)

  agent.getStats().then(function (res) {
    t.ok(Array.isArray(res), 'response is an array')
    t.end()
  })
})

test('getTorrentDetails: returns torrent details', function (t) {
  var agent = new Agent(opts)

  agent.getTorrentDetails().then(function (res) {
    t.end()
  })
})
