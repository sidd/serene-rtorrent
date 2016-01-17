module.exports = {
  infohash: 'd.get_hash=',
  state: function (val, values) {
    var status
    switch (values['d.is_active=']) {
      case '0':
        status = +values['d.is_open='] ? 'paused' : 'stopped'
        break
      case '1':
        status = +values['d.get_left_bytes='] ? 'uploading' : 'downloading'
        break
    }
    return values['d.is_hash_checking='] === '1'
      ? 'checking'
      : status
  },
  upload_total: 'get_up_total',
  download_total: 'get_down_total'
}
