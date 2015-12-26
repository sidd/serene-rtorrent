var getTorrents = require('../lib/client').getTorrents

getTorrents().catch(err => console.error(err)).then(res => console.log(res))
