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
  params = queries.getTorrents
  return new Promise(function (resolve, reject) {
    client.methodCall.apply(client, params.concat(function (err, value) {
      if (err) return reject(err)
      resolve(mapParamsToResponse(params[1], 'getTorrents', value))
    }))
  })
}

exports.getTorrent = function (infohash) {
  params = queries.getTorrent(infohash)
  return new Promise(function (resolve, reject) {
    client.methodCall.apply(client, params.concat(function (err, value) {
      if (err) return reject(err)
      var response = mapParamsToResponse(params[1], 'getTorrent', value, 2)
      if (!response.infohash) {
        response.infohash = infohash
      }
      resolve(response)
    }))
  })

}

exports.updateTorrentStatus = function (infohash, status) {
  params = queries.updateTorrentStatus(infohash, status)
  return new Promise(function (resolve, reject) {
    client.methodCall.apply(client, params.concat(function (err, value) {
      if (err) return reject(err)
      console.log(value)
      resolve(value)
    }))
  })
}

exports.removeTorrent = function (infohash) {
  params = queries.removeTorrent(infohash)
  return new Promise(function (resolve, reject) {
    client.methodCall.apply(client, params.concat(function (err, value) {
      if (err) return reject(err)
      resolve(value)
    }))
  })
}
