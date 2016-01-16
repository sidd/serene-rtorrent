var xmlrpc = require('xmlrpc')
var Base64Type = require('./Base64Type')
var parseUrl = require('url').parse

module.exports = Agent
module.exports.multicall = multicall

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


Agent.prototype.getTorrentDetails = function () {
  var agent = this.agent
  var infohash = 'B0A17A49DA5D39509A548A8C6DC68F8CAA1A5D36'
  return new Promise(function (resolve, reject) {
    agent.methodCall.apply(agent, multicall({
      'f.multicall': [infohash, '', 'f.get_completed_chunks=', 'f.get_frozen_path=', 'f.get_last_touched='],
      't.multicall': [infohash, '', 't.get_group=', 't.get_id=', 't.get_min_interval=']
    }).concat(function (err, res) {
      if (err) return reject(err)
      resolve(res)
    }))
  })
}

Agent.prototype.getTorrents = function () {
  var agent = this.agent
  var params = ['main', 'd.get_hash=', 'd.is_open=', 'd.is_hash_checking=', 'd.is_hash_checked=', 'd.get_state=', 'd.get_name=', 'd.get_size_bytes=', 'd.get_completed_chunks=', 'd.get_size_chunks=', 'd.get_bytes_done=', 'd.get_up_total=', 'd.get_ratio=', 'd.get_up_rate=', 'd.get_down_rate=', 'd.get_chunk_size=', 'd.get_custom1=', 'd.get_peers_accounted=', 'd.get_peers_not_connected=', 'd.get_peers_connected=', 'd.get_peers_complete=', 'd.get_left_bytes=', 'd.get_priority=', 'd.get_state_changed=', 'd.get_skip_total=', 'd.get_hashing=', 'd.get_chunks_hashed=', 'd.get_base_path=', 'd.get_creation_date=', 'd.get_tracker_focus=', 'd.is_active=', 'd.get_message=', 'd.get_custom2=', 'd.get_free_diskspace=', 'd.is_private=', 'd.is_multi_file=']

  return new Promise(function (resolve, reject) {
    agent.methodCall('d.multicall', params, function (err, res) {
      if (err) return reject(err)
      resolve(res)
    })
  }).then(function (res) {
    return mapMulticall(params, res)
  })
}

function mapMulticall (params, values) {
  return params.filter(function (param) {
    return param.indexOf('=') > -1
  }).reduce(function (obj, param, index) {
    obj[param] = values[0][index]
    return obj
  }, {})
}

Agent.prototype.addTorrents = function () {
  return promise(function () {console.log('hi')})
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
  return new Promise(function (resolve, reject) {
    agent.methodCall.apply(agent, multicall(['get_up_total', 'get_down_total']).concat(function (err, res) {
      if (err) return reject(err)
      resolve(res)
    }))
  })
}
