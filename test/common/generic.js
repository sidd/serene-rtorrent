var test = require('tape')
var Provider = require('../../')
var Agent = require('../../lib/agent')
var opts = { host: 'http://localhost:8080/RPC2' }

test('getStats: returns client stats', function (t) {
  var agent = new Agent(opts)

  agent.getStats().then(function (res) {
    t.ok(res, 'response received')
    t.ok(typeof res.download_total === 'number', 'value mapped')
    t.end()
  })
})

