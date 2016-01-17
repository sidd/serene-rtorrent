var test = require('tape')
var Agent = require('../../lib/agent')

var res = require('../fixtures/xubuntu.json')

var toCompute = ['infohash', 'name', 'bytes_total', 'bytes_remaining', 'bytes_downloaded', 'bytes_uploaded', 'status', 'num_chunks_downloaded', 'num_chunks', 'chunk_size', 'ratio', 'download_speed', 'upload_speed', 'num_leechers', 'num_seeders', 'path', 'created_at', 'is_private']

test('present maps response values', function (t) {
  var presented = Agent._present(toCompute)(res)

  t.ok(presented, 'produces object from input')
  t.ok(presented.status, 'function presenter successful')
  t.ok(presented.infohash, 'value presenter successful')

  t.end()
})
