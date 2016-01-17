var test = require('tape')
var Agent = require('../../lib/agent')
var xml2js = require('xml2js').parseString
var Serializer = require('xmlrpc/lib/Serializer')

// test('multicall: queries non-namespaced parameters', function (t) {
//   var query = Agent.multicall(['get_up_total', 'get_down_total'])

//   t.ok(Array.isArray(query), 'generates array with keys')
//   t.ok(query[0] === 'system.multicall', 'method is system.multicall')

//   var serialized = Serializer.serializeMethodCall(query[0], query.slice(1))

//   xml2js(serialized, function (err, result) {
//     if (err) return t.fail('invalid xml')
//     t.ok(result.methodCall.methodName[0] === 'system.multicall', 'multicall is serialized')
//     t.ok(result.methodCall.params[0]
//       .param[0].value[0].array[0]
//       .data[0].value[0].array[0]
//       .data[0].value[0].struct[0]
//       .member[0].value[0].string[0] === 'get_up_total', 'method is serialized')
//     t.end()
//   })
// })

test('multicall: generates non-system multicall for single cmd', function (t) {
  var query = Agent._multicall({
    'd.multicall': ['d.get_hash=', 'd.is_open=', 'd.is_hash_checking=', 'd.is_hash_checked=']
  })

  t.ok(Array.isArray(query), 'response is an array')
  t.ok(query[0] === 'd.multicall', 'response contains command as first index')
  t.end()
})

test('multicall: generates system.multicall for multiple cmds', function (t) {
  var commands = {
    'f.multicall': ['', '', 'f.get_completed_chunks=', 'f.get_frozen_path=', 'f.get_last_touched='],
    't.multicall': ['', '', 't.get_group=', 't.get_id=', 't.get_min_interval=', 't.get_normal_interval=']
  }

  var query = Agent._multicall(commands)

  t.ok(query[0] === 'system.multicall', 'response is a system.multicall')
  t.ok(query[1][0][0].params.length === commands['f.multicall'].length, 'params sent are same as specified')
  t.end()
})

