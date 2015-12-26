var xmlrpc = require('xmlrpc')
var inherits = require('util').inherits

var Base64Type = function (raw) {
  xmlrpc.CustomType.call(this, raw)
}

inherits(Base64Type, xmlrpc.CustomType)
Base64Type.prototype.tagName = 'base64'

module.exports = Base64Type
