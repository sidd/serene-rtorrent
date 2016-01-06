var getTorrentDetails = require('../lib/client').getTorrentDetails

getTorrentDetails('4CB67059ED6BD08362DA625B3AE77F6F4A075705').catch(err => console.error(err)).then(res => console.log(res))
