var xmlrpc = require('xmlrpc')
var Base64Type = require('./Base64Type')
var parseUrl = require('url').parse

var compute = require('./compute')

module.exports = Agent
module.exports._multicall = multicall
module.exports._present = present

// parses credentials to pass to `xmlrpc`
function Agent (opts) {
  opts = opts || {}

  if (!(this instanceof Agent)) {
    return new Agent(opts)
  }

  if (!opts.host) {
    throw new Error("Parameter 'host' not specified")
  }

  var url = parseUrl(opts.host)
  var agentOpts = {
    host: url.hostname || 'localhost',
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.path || '/'
  }

  var isSecure = url.protocol === 'https:'

  if (isSecure) {
    agentOpts.rejectUnauthorized = false
  }

  if (opts.username || opts.password) {
    var basicAuth = {}
    if (opts.username) {
      basicAuth.user = opts.username
    }
    if (opts.password) {
      basicAuth.pass = opts.password
    }
    agentOpts.basic_auth = basicAuth
  }

  this.agent = isSecure
    ? xmlrpc.createSecureClient(agentOpts)
    : xmlrpc.createClient(agentOpts)
  this.provider = opts.provider
}

Agent.prototype.getTorrentDetails = function (infohash) {
  var agent = this.agent
  var params = {
    'f.multicall': [infohash, '', 'f.get_completed_chunks=', 'f.get_frozen_path=', 'f.get_last_touched='],
    't.multicall': [infohash, '', 't.get_group=', 't.get_id=', 't.get_min_interval=']
  }

  var toCompute = ['f.get_completed_chunks=']
  return new Promise(function (resolve, reject) {
    if (!infohash) return reject(new Error("Required parameter 'infohash' was not specified."))
    agent.methodCall.apply(agent, multicall(params).concat(function (err, res) {
      if (err) return reject(err)
      resolve(res)
    }))
  }).then(mapMulticall(params))
}

Agent.prototype.getTorrents = function () {
  var agent = this.agent
  var params = ['main', 'd.get_hash=', 'd.is_open=', 'd.is_hash_checking=', 'd.is_hash_checked=', 'd.get_state=', 'd.get_name=', 'd.get_size_bytes=', 'd.get_completed_chunks=', 'd.get_size_chunks=', 'd.get_bytes_done=', 'd.get_up_total=', 'd.get_ratio=', 'd.get_up_rate=', 'd.get_down_rate=', 'd.get_chunk_size=', 'd.get_custom1=', 'd.get_peers_accounted=', 'd.get_peers_not_connected=', 'd.get_peers_connected=', 'd.get_peers_complete=', 'd.get_left_bytes=', 'd.get_priority=', 'd.get_state_changed=', 'd.get_skip_total=', 'd.get_hashing=', 'd.get_chunks_hashed=', 'd.get_base_path=', 'd.get_creation_date=', 'd.get_tracker_focus=', 'd.is_active=', 'd.get_message=', 'd.get_custom2=', 'd.get_free_diskspace=', 'd.is_private=', 'd.is_multi_file=']

  var toCompute = ['infohash', 'name', 'bytes_total', 'bytes_remaining', 'bytes_downloaded', 'bytes_uploaded', 'state', 'num_chunks_downloaded', 'num_chunks', 'chunk_size', 'ratio', 'download_speed', 'upload_speed', 'num_leechers', 'num_seeders', 'path', 'created_at', 'is_private']

  return new Promise(function (resolve, reject) {
    agent.methodCall('d.multicall', params, function (err, res) {
      if (err) return reject(err)
      resolve(res)
    })
  }).then(mapMulticall(params)).then(present(toCompute))
}

Agent.prototype.addTorrents = function (torrents) {
  var agent = this.agent
  return new Promise(function (resolve, reject) {
    console.log(torrents)
  })
}

Agent.prototype.testConnection = function () {
  var agent = this.agent
  return new Promise(function (resolve, reject) {
    agent.methodCall('system.listMethods', [], function (err, res) {
      if (err) return reject(err)
      resolve(res)
    })
  })
}

Agent.prototype.getStats = function () {
  var agent = this.agent
  var params = ['get_up_total', 'get_down_total']

  var toCompute = ['download_total', 'upload_total']

  return new Promise(function (resolve, reject) {
    agent.methodCall.apply(agent, multicall(params).concat(function (err, res) {
      if (err) return reject(err)
      resolve([res])
    }))
  }).then(mapMulticall(params, true)).then(present(toCompute))
}

// Helper functions

/**
 * Generates query for an XMLRPC multicall
 * @param  {Object} commands Parameters to include in multicall
 * @return {Array}           Assembled query
 */
function multicall (commands) {
  if (Array.isArray(commands)) {
    commands = {
      'system.multicall': commands
    }
  }

  var keys = Object.keys(commands)

  // if it's a single command, don't make a system.multicall
  if (keys.length === 1) {
    return [keys[0], [parameterize(commands[keys[0]])]]
  }

  var commandsAsParams = []
  keys.forEach(function (key) {
    commandsAsParams = commandsAsParams.concat(parameterize([key], commands[key]))
  })

  return ['system.multicall', [commandsAsParams]]

  // converts a command (and its params) to an XMLRPC struct
  function parameterize (commands, params) {
    return commands.reduce(function (result, command) {
      return result.concat({
        methodName: command,
        params: params || []
      })
    }, [])
  }
}

// maps multicall array responses to a keyed object
// if an object is received, it maps each key as an array,
// and then returned the merged map
function mapMulticall (params, disableFilter) {
  return function (values) {
    if (!Array.isArray(params)) {
      var res = {}
      Object.keys(params).forEach(function (param, index) {
        Object.assign(res, map(params[param], values[index][0]))
      })
      return res
    } else {
      return map(params, values)
    }

    function map (params, values) {
      return params.filter(function (param) {
        return disableFilter || param.indexOf('=') > -1
      }).reduce(function (obj, param, index) {
        obj[param] = values[0][index]

        // sometimes, a response is wrapped in an single-element array
        // if this is the case, resolve the single element's value
        while (Array.isArray(obj[param]) && obj[param].length === 1) {
          obj[param] = obj[param][0]
        }

        return obj
      }, {})
    }

  }
}

// initialized with data to compute
// returns a function which can easily
// be chained as a promise handler
function present (toCompute) {
  return function (res) {
    return toCompute.reduce(function (obj, val) {
      obj[val] = typeof compute[val] === 'function'
        ? compute[val](val, res)
        : res[compute[val]]
      if (!isNaN(+obj[val])) {
        obj[val] = +obj[val]
      }
      return obj
    }, {})
  }
}
