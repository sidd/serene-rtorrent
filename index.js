var client = require('./lib/client')

exports.name = 'rtorrent'
exports.prettyName = 'rTorrent'
exports.description = 'Interfaces directly with rTorrent\'s XMLRPC SCGI socket exposed via HTTP.'

exports.getTorrents = function () {
  return {
    type: 'TORRENTS',
    payload: {
      promise: client.getTorrents()
    }
  }
}

exports.getTorrent = function (infohash) {
  return {
    type: 'TORRENTS_DETAILS',
    payload: {
      promise: client.getTorrent(infohash)
    }
  }
}

exports.addTorrent = function (torrent) {
  return {
    type: 'TORRENTS_ADD',
    payload: {
      promise: client.addTorrent(torrent)
    }
  }
}

exports.updateTorrentStatus = function (infohash, status) {
  if (!infohash) {
    return
  }
  if (typeof infohash === 'object') {
    status = infohash.status
    infohash = infohash.infohash
  }
  return {
    type: 'TORRENTS_UPDATE',
    payload: {
      promise: client.updateTorrentStatus(infohash, status)
    }
  }
}

exports.removeTorrent = function (infohash) {
  if (!infohash) {
    return
  }
  if (typeof infohash === 'object') {
    infohash = infohash.infohash
  }
  return {
    type: 'TORRENTS_REMOVE',
    payload: {
      promise: client.removeTorrent(infohash)
    }
  }
}
