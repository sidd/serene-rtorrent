var test = require('tape')
var Provider = require('../')
var Agent = require('../lib/agent')
var opts = { host: 'http://localhost:8080/RPC2' }

if (process) {
  process.on('unhandledRejection', function (reason, p) {
    console.log(p)
  })
}

test('throws if no connection info specified', function (t) {
  try {
    new Provider()
  } catch (err) {
    t.ok(err)
    t.end()
  }
})

test('doesn\'t throw when URL only parameter', function (t) {
  try {
    new Provider(opts)
  } catch (err) {
    t.fail('initialization threw error')
  }
  t.end()
})

test('testConnection rejects if host is not xmlrpc', function (t) {
  t.plan(1)
  var agent = new Agent({ host: 'http://localhost:8080/' })

  agent.testConnection().catch(function (err) {
    t.ok(err, 'caught error')
  })
})

test('testConnection retrieves method listing', function (t) {
  t.plan(1)
  var agent = new Agent(opts)

  agent.testConnection().then(function (res) {
    t.ok(Array.isArray(res))
  })
})

