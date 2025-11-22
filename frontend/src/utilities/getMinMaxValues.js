export function getMinMaxValues(dataMap) {
  var values = [];
  for (var key in dataMap) {
    if (dataMap.hasOwnProperty(key)) {
      var val = dataMap[key];
      if (val != null && !isNaN(val)) {
        values.push(val);
      }
    }
  }
  var minValue = values.length ? Math.min.apply(null, values) : 0;
  var maxValue = values.length ? Math.max.apply(null, values) : 1;
  return { minValue, maxValue };
}
