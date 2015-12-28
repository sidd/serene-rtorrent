var removeTorrent = require('../lib/client').removeTorrent

removeTorrent('4CB67059ED6BD08362DA625B3AE77F6F4A075705', 'start').catch(err => console.error(err)).then(res => console.log(res))
