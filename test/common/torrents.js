var fs = require('fs')
var path = require('path')
var test = require('tape')
var Provider = require('../../')
var Agent = require('../../lib/agent')
var opts = { host: 'http://localhost:8080/RPC2' }

var xubuntu = require('../fixtures/xubuntu.json')

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

test('getTorrents: returns active torrents', function (t) {
  var agent = new Agent(opts)

  agent.getTorrents().then(function (res) {
    t.ok(Array.isArray(res), 'response is array')
    t.ok(res.length, 'array is not empty')
    t.ok(res[0].status, 'object contains a transfer\'s status')
    return delay(1000).then(t.end)
  })
})

test('getTorrentDetails: returns torrent details', function (t) {
  var agent = new Agent(opts)

  agent.getTorrentDetails(xubuntu['d.get_hash']).then(function (res) {
    t.ok(res.url, 'contains tracker url')
    t.ok(typeof res.is_enabled !== 'undefined', 'contains tracker status')
    return delay(1000).then(t.end)
  })
})
