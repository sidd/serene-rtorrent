var Client = require('./lib/client')

function SereneRtorrentXmlrpcPlugin (opts) {
  this._client = new Client(opts)
}

SereneRtorrentXmlrpcPlugin.nameIdentifier = SereneRtorrentXmlrpcPlugin.prototype.nameIdentifier = 'rtorrent'
SereneRtorrentXmlrpcPlugin.prettyName = SereneRtorrentXmlrpcPlugin.prototype.prettyName = 'rTorrent'
SereneRtorrentXmlrpcPlugin.description = SereneRtorrentXmlrpcPlugin.prototype.description = 'Interfaces directly with rTorrent\'s XMLRPC SCGI socket exposed via HTTP.'
SereneRtorrentXmlrpcPlugin.build = SereneRtorrentXmlrpcPlugin.prototype.build = SereneRtorrentXmlrpcPlugin
SereneRtorrentXmlrpcPlugin.options = SereneRtorrentXmlrpcPlugin.prototype.options = {
  host: true,
  username: true,
  password: true
}

SereneRtorrentXmlrpcPlugin.prototype.getTorrents = function (view) {
  return {
    type: 'PROVIDER_TORRENTS',
    payload: {
      promise: this._client.getTorrents(view)
    }
  }
}

SereneRtorrentXmlrpcPlugin.prototype.getTorrentDetails = function (infohash) {
  return {
    type: 'PROVIDER_TORRENTS_DETAILS',
    payload: {
      promise: this._client.getTorrentDetails(infohash)
    }
  }
}

SereneRtorrentXmlrpcPlugin.prototype.addTorrent = function (torrent) {
  return {
    type: 'PROVIDER_TORRENTS_ADD',
    payload: {
      promise: this._client.addTorrent(torrent)
    }
  }
}

SereneRtorrentXmlrpcPlugin.prototype.updateTorrentStatus = function (infohash, status) {
  if (!infohash) {
    return
  }
  if (typeof infohash === 'object') {
    status = infohash.status
    infohash = infohash.infohash
  }
  return {
    type: 'PROVIDER_TORRENTS_UPDATE',
    payload: {
      promise: this._client.updateTorrentStatus(infohash, status)
    }
  }
}

SereneRtorrentXmlrpcPlugin.prototype.removeTorrent = function (infohash) {
  if (!infohash) {
    return
  }
  if (typeof infohash === 'object') {
    infohash = infohash.infohash
  }
  return {
    type: 'PROVIDER_TORRENTS_REMOVE',
    payload: {
      promise: this._client.removeTorrent(infohash)
    }
  }
}

SereneRtorrentXmlrpcPlugin.prototype.getStats = function () {
  return {
    type: 'PROVIDER_STATS',
    payload: {
      promise: this._client.getStats()
    }
  }
}

module.exports = SereneRtorrentXmlrpcPlugin
