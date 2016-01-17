/**
 * A simple map whose keys are mapped to either a String or Function.
 *
 * String values are from the XMLRPC API
 * Functions receive 2 arguments, and can be used to compute a value.
 * TODO: maybe use Getters instead, so that agent.js can be cleaned up a bit
 */
module.exports = {
  bytes_downloaded: 'd.get_bytes_done',
  bytes_remaining: 'd.get_left_bytes',
  bytes_total: 'd.get_size_bytes',
  bytes_uploaded: 'd.get_up_total',
  chunk_size: 'd.get_chunk_size',
  created_at: 'd.get_creation_date',
  download_rate: 'get_down_rate',
  download_rate_max: 'get_download_rate',
  download_speed: 'd.get_down_rate',
  download_total: 'get_down_total',
  free_disk_space: 'd.get_free_diskspace',
  infohash: 'd.get_hash',
  is_enabled: 't.is_enabled',
  is_hash_checked: 'd.is_hash_checked',
  is_hash_checking: 'd.is_hash_checking',
  is_open: 't.is_open',
  is_private: 'd.is_private',
  name: 'd.get_name',
  num_chunks: 'd.get_size_chunks',
  num_chunks_downloaded: 'd.get_completed_chunks',
  path: 'd.get_base_path',
  num_leechers: 'd.get_peers_accounted',
  protocol: 't.get_type',
  ratio: 'd.get_ratio',
  num_seeders: 'd.get_peers_complete',
  status: function (val, values) {
    var status
    switch (values['d.is_active']) {
      case '0':
        status = +values['d.is_open'] ? 'paused' : 'stopped'
        break
      case '1':
        status = +values['d.get_left_bytes'] ? 'uploading' : 'downloading'
        break
    }
    return values['d.is_hash_checking'] === '1'
      ? 'checking'
      : status
  },
  upload_rate: 'get_up_rate',
  upload_rate_max: 'get_upload_rate',
  upload_speed: 'd.get_up_rate',
  upload_total: 'get_up_total',
  url: 't.get_url'
}
