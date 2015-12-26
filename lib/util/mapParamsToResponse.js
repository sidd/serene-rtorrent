var transforms = require('../transforms').getTorrents

module.exports = function (params, values) {
  var col
  params.shift()
  return values.map(function (val) {
    return val.reduce(function (res, data, index) {
      col = transforms[params[index]]
      if (col != null) {
        res[col] = data
      }
      return res
    }, {})
  })
}
