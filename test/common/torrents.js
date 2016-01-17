var test = require('tape')
var Provider = require('../../')
var Agent = require('../../lib/agent')
var opts = { host: 'http://localhost:8080/RPC2' }

var xubuntu = require('../fixtures/xubuntu.json')

test('getTorrents: returns active torrents', function (t) {
  var agent = new Agent(opts)

  agent.getTorrents().then(function (res) {
    t.ok(typeof res !== null && typeof res === 'object', 'response is object')
    t.ok(Object.keys(res).length, 'object is not empty')
    t.ok(res.state, 'object contains transfer state')
    t.end()
  })
})

test('getTorrentDetails: returns torrent details', function (t) {
  var agent = new Agent(opts)

  agent.getTorrentDetails(xubuntu['d.get_hash=']).then(function (res) {
    console.log(res)
    t.end()
  })
})
