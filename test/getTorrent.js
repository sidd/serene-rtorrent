var getTorrent = require('../lib/client').getTorrent

getTorrent('DAB7AA5EB753F9B275BFD31D333542AEACFC4F7B').catch(err => console.error(err)).then(res => console.log(res))
