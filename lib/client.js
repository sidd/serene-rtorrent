require('es6-promise').polyfill()
var xmlrpc = require('xmlrpc')
var client = xmlrpc.createClient({ host: 'localhost', port: '8080', path: '/RPC2' })
var mapParamsToResponse = require('./util/mapParamsToResponse')
var queries = require('./queries')
var Base64Type = require('./Base64Type')

exports.addTorrent = function (torrent) {
  return new Promise(function (resolve, reject) {
    client.methodCall('load.raw_verbose', ['', new Base64Type(torrent)], function (err, value) {
      if (err) return reject(err)
      resolve(value)
    })
  })
}

exports.getTorrents = function () {
  queries = queries.getTorrents
  return new Promise(function (resolve, reject) {
    client.methodCall.apply(client, queries.concat(function (err, value) {
      if (err) return reject(err)
      resolve(mapParamsToResponse(queries[1], value))
    }))
  })
}
