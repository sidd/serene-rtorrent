exports.getTorrents = ['d.multicall', ['main', 'd.get_hash=', 'd.is_open=', 'd.is_hash_checking=', 'd.is_hash_checked=', 'd.get_state=', 'd.get_name=', 'd.get_size_bytes=', 'd.get_completed_chunks=', 'd.get_size_chunks=', 'd.get_bytes_done=', 'd.get_up_total=', 'd.get_ratio=', 'd.get_up_rate=', 'd.get_down_rate=', 'd.get_chunk_size=', 'd.get_custom1=', 'd.get_peers_accounted=', 'd.get_peers_not_connected=', 'd.get_peers_connected=', 'd.get_peers_complete=', 'd.get_left_bytes=', 'd.get_priority=', 'd.get_state_changed=', 'd.get_skip_total=', 'd.get_hashing=', 'd.get_chunks_hashed=', 'd.get_base_path=', 'd.get_creation_date=', 'd.get_tracker_focus=', 'd.is_active=', 'd.get_message=', 'd.get_custom2=', 'd.get_free_diskspace=', 'd.is_private=', 'd.is_multi_file=']]

exports.getTorrent = function (infohash) {
  return ['f.multicall', [infohash, '', 'f.get_completed_chunks=', 'f.get_frozen_path=', 'f.get_last_touched=', 'f.get_match_depth_next=', 'f.get_match_depth_prev=', 'f.get_offset=', 'f.get_path=', 'f.get_path_components=', 'f.get_path_depth=', 'f.get_priority=', 'f.get_range_first=', 'f.get_range_second=', 'f.get_size_bytes=', 'f.get_size_chunks=', 'f.is_create_queued=', 'f.is_created=', 'f.is_open=', 'f.is_resize_queued=']]
}

exports.updateTorrentStatus = function (infohash, status) {
  var commands
  var command
  switch (status) {
    case 'start':
      commands = ['d.open', 'd.start']
      break
    case 'stop':
      commands = ['d.stop', 'd.close']
      break
    case 'pause':
      command = 'd.pause'
      break
  }

  if (commands) {
    commands = commands.reduce((arr, el) => {
      arr.push({
        methodName: el,
        params: [infohash]
      })
      return arr
    }, [])

    console.log(commands)
  }
  var Serializer = require('xmlrpc/lib/serializer')

  console.log(Serializer.serializeMethodCall('system.multicall', [commands]))
  return ['system.multicall', [commands] || [command] ]
}

exports.removeTorrent = function (infohash) {
  return ['d.erase', [infohash]]
}
