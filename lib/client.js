var xmlrpc = require('xmlrpc')
var mapParamsToResponse = require('./util/mapParamsToResponse')
var queries = require('./queries')
var Base64Type = require('./Base64Type')
var parseUrl = require('url').parse

function Client (opts) {
  opts = opts || {}
  if (!(this instanceof Client)) {
    return new Client(opts)
  }
  var url = parseUrl(opts.host)

  var clientOpts = {
    host: url.hostname || 'localhost',
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.path || '/'
  }

  var isSecure = url.protocol === 'https:'

  if (isSecure) {
    clientOpts.rejectUnauthorized = false
  }

  if (opts.username || opts.password) {
    var basicAuth = {}
    if (opts.username) {
      basicAuth.user = opts.username
    }
    if (opts.password) {
      basicAuth.pass = opts.password
    }
    clientOpts.basic_auth = basicAuth
  }

  this._client = isSecure
    ? xmlrpc.createSecureClient(clientOpts)
    : xmlrpc.createClient(clientOpts)
  this._provider = opts.provider
}

// TODO: use parse-torrent + buffer instead of FileReader
//       (so this works in Node too!)
Client.prototype.addTorrent = function (torrents) {
  var client = this._client
  torrents = Array.prototype.slice.call(torrents)
  var promisesCreated = torrents.length
  var promises = []

  return new Promise(function (resolve, reject) {
    torrents.forEach(function (torrent) {
      read(torrent)
    })

    function read (torrent) {
      var reader = new window.FileReader()
      reader.addEventListener('load', function (file) {
        var torrentBase64 = file.target.result.slice(37)

        promises.push(new Promise(function (resolve, reject) {
          client.methodCall('load.raw_start', ['', new Base64Type(torrentBase64)], function (err, value) {
            if (err) return reject(err)
            resolve(value)
          })
        }))

        promisesCreated -= 1
        if (promisesCreated === 0) {
          resolve(Promise.all(promises))
        }
      })
      reader.readAsDataURL(torrent)
    }
  })
}

Client.prototype.getTorrents = function () {
  var client = this._client
  var params = queries.getTorrents()
  return new Promise(function (resolve, reject) {
    client.methodCall.apply(client, params.concat(function (err, value) {
      if (err) return reject(err)
      resolve(mapParamsToResponse(params[1], 'getTorrents', value))
    }))
  })
}

Client.prototype.getTorrentDetails = function (infohash) {
  var client = this._client
  var params = queries.getTorrentDetails(infohash)
  return new Promise(function (resolve, reject) {
    client.methodCall.apply(client, params.concat(function (err, value) {
      if (err) return reject(err)
      var files = mapParamsToResponse(params[1][0][0].params, 'getTorrentDetails', value[0][0], 2)
      var trackers = mapParamsToResponse(params[1][0][1].params, 'getTorrentDetails', value[1][0], 2)
      resolve({
        trackers: trackers,
        files: files,
        infohash: infohash
      })
    }))
  })
}

Client.prototype.updateTorrentStatus = function (infohash, status) {
  var client = this._client
  var params = queries.updateTorrentStatus(infohash, status)
  return new Promise(function (resolve, reject) {
    client.methodCall.apply(client, params.concat(function (err, value) {
      if (err) return reject(err)
      resolve(value)
    }))
  })
}

Client.prototype.removeTorrent = function (infohash) {
  var client = this._client
  var params = queries.removeTorrent(infohash)
  return new Promise(function (resolve, reject) {
    client.methodCall.apply(client, params.concat(function (err, value) {
      if (err) return reject(err)
      resolve(value)
    }))
  })
}

Client.prototype.getStats = function () {
  var self = this
  var client = self._client
  var params = queries.getStats
  return new Promise(function (resolve, reject) {
    client.methodCall.apply(client, params.concat(function (err, value) {
      params = params[1][0].map(function (a, b) {
        return a.methodName
      })
      if (err) return reject(err)
      var response = mapParamsToResponse(params, 'getStats', [value.reduce(function (a, b) {
        return a.concat(b)
      })], 0)[0]
      response.provider = self._provider
      resolve(response)
    }))
  })
}

module.exports = Client
