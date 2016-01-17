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

test('updateTorrentStatus', function (t) {
  var agent = new Agent(opts)

  agent.updateTorrentStatus(xubuntu['d.get_hash'], 'stop').then(function (res) {
    t.ok(typeof res !== 'undefined', 'response received')
    return delay(1000).then(t.end)
  })
})

test('removeTorrent', function (t) {
  var agent = new Agent(opts)

  agent.removeTorrent(xubuntu['d.get_hash']).then(function (res) {
    t.ok(typeof res !== 'undefined', 'response received')
    return delay(1000).then(t.end)
  })
})
