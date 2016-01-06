var transforms = require('../transforms')

module.exports = function (params, transformsKey, values, sliceAmount) {
  var specificTransforms = transforms[transformsKey]
  var col
  var paramMappable = [].concat(params.slice(sliceAmount !== undefined ? sliceAmount : 1))
  return values.map(function (val) {
    return val.reduce(function (res, data, index) {
      col = specificTransforms[paramMappable[index]]
      if (col != null) {
        res[col] = data
      }
      return res
    }, {})
  })
}
