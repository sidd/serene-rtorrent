module.exports = SereneRtorrentProvider

var Agent = require('./lib/agent')

function SereneRtorrentProvider (opts) {
  this.agent = new Agent(opts)
}

SereneRtorrentProvider.prototype.config = require('./package.json').serene
wrap(SereneRtorrentProvider.prototype, Agent.prototype, {
  addTorrents: 'TORRENTS_ADD',
  getTorrents: 'TORRENTS',
  testConnection: 'CONNECTION_TEST',
  getStats: 'STATS',
  updateTorrentStatus: 'TORRENTS_UPDATE',
  removeTorrent: 'TORRENTS_REMOVE'
})

// Helper functions

// copies methods from `src` to `dest`
function wrap (dest, src, types) {
  for (var fn in src) {
    dest[fn] = action(src[fn], types[fn])
  }
}

// converts methods to Serene actions
function action (fn, type, prefix) {
  prefix = prefix || 'PROVIDER_'

  return function () {
    var args = [].slice.call(arguments)

    return {
      type: prefix + type,
      payload: {
        promise: fn.call(this.agent, args)
      }
    }
  }
}
