var updateTorrentStatus = require('../lib/client').updateTorrentStatus

;['start', 'stop', 'start', 'stop'].forEach((el, i) =>
  setTimeout(() => updateTorrentStatus('4CB67059ED6BD08362DA625B3AE77F6F4A075705', el).catch(err => console.error(err)).then(res => console.log(res)), 1000 * i)
)
