var client = require('./lib/client')

exports.getTorrents = function () {
  return {
    type: 'TORRENTS',
    payload: {
      promise: client.getTorrents()
    }
  }
}

exports.addTorrent = function () {
  return {
    type: 'ADD_TORRENT',
    payload: {
      promise: client.addTorrent()
    }
  }
}

exports.getTorrents().payload.promise.catch(e => console.error(e)).then(res => console.log(res))
