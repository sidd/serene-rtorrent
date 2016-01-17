var fs = require('fs')
var path = require('path')
var test = require('tape')
var Agent = require('../../lib/agent')
var opts = { host: 'http://localhost:8080/RPC2' }

function delay (time) {
  return new Promise(function (fulfill) {
    setTimeout(fulfill, time)
  })
}

// move to node-only test
test('addTorrents: adds torrents from buffers', function (t) {
  var buf1 = fs.readFileSync(path.resolve(__dirname, '../xubuntu.torrent'))
  var buf2 = fs.readFileSync(path.resolve(__dirname, '../ubuntu.torrent'))
  var agent = new Agent(opts)

  agent.addTorrents([buf1, buf2]).then(function (res) {
    t.ok(res === 0, 'response received')
    return delay(1000).then(t.end)
  })
})

