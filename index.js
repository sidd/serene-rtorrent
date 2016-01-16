var Agent = require('./lib/agent')

function wrap (methods, types) {
  var wrapped = {}

  for (var fn in methods) {
    wrapped[fn] = action(methods[fn], types[fn])
  }

  return wrapped
}


function action (fn, type, prefix) {
  prefix = prefix || 'PROVIDER_'

  return function () {
    var args = [].slice.call(arguments)

    return {
      type: prefix + type,
      payload: {
        promise: fn.call(null, args)
      }
    }
  }
}

module.exports = SereneRtorrentProvider

function SereneRtorrentProvider (opts) {
  this.agent = new Agent(opts)
}

SereneRtorrentProvider.prototype = wrap(Agent.prototype, {
  addTorrents: 'TORRENTS_ADD',
  getTorrents: 'TORRENTS',
  testConnection: 'CONNECTION_TEST'
})

// SereneRtorrentProvider.prototype.addTorrent = function (torrent) {
//   return {
//     type: 'PROVIDER_TORRENTS_ADD',
//     payload: {
//       promise: this.requester.addTorrent(torrent)
//     }
//   }
// }

// SereneRtorrentProvider.prototype.updateTorrentStatus = function (infohash, status) {
//   if (!infohash) {
//     return
//   }
//   if (typeof infohash === 'object') {
//     status = infohash.status
//     infohash = infohash.infohash
//   }
//   return {
//     type: 'PROVIDER_TORRENTS_UPDATE',
//     payload: {
//       promise: this.requester.updateTorrentStatus(infohash, status)
//     }
//   }
// }

// SereneRtorrentProvider.prototype.removeTorrent = function (infohash) {
//   if (!infohash) {
//     return
//   }
//   if (typeof infohash === 'object') {
//     infohash = infohash.infohash
//   }
//   return {
//     type: 'PROVIDER_TORRENTS_REMOVE',
//     payload: {
//       promise: this.requester.removeTorrent(infohash)
//     }
//   }
// }

// SereneRtorrentProvider.prototype.getStats = function () {
//   return {
//     type: 'PROVIDER_STATS',
//     payload: {
//       promise: this.requester.getStats()
//     }
//   }
// }

// SereneRtorrentProvider.prototype.testConnection = function (connectionId) {
//   var data = {}
//   data[connectionId] = {
//     isFetching: true
//   }

//   return {
//     type: 'PROVIDER_CONNECTION_TEST',
//     payload: {
//       promise: this.requester.testConnection(),
//       data: data
//     }
//   }
// }

