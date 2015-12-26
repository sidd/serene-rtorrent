var transforms = require('../transforms').getTorrents

module.exports = function (params, values) {
  var col
  return values.map(function (val) {
    params.shift()
    return val.reduce(function (res, data, index) {
      col = transforms[params[index]]
      if (col != null) {
        res[col] = data
      }
      return res
    }, {})
  })
}
