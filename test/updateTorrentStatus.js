var updateTorrentStatus = require('../lib/client').updateTorrentStatus

;['start', 'stop', 'start', 'stop'].forEach((el, i) =>
  setTimeout(() => updateTorrentStatus('3F19B149F53A50E14FC0B79926A391896EABAB6F', el).catch(err => console.error(err)).then(res => console.log(res)), 1000 * i)
)
