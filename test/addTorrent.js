var addTorrent = require('../lib/client').addTorrent
var fs = require('fs')

fs.readFile(__dirname + '/xubuntu.torrent', function (err, data) {
  data = new Buffer(data).toString('base64')
  if (err) console.error(err)
  addTorrent(data).catch(e => console.error(e)).then(val => console.log(val))
})
