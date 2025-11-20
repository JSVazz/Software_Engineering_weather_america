// aggregateClimateData.js

/**
 * Supported aggregation types: "avg", "variance", "min", "max", "median", "sum"
 * @param {Array} dataRows - Array of weather data rows (objects from WeatherDataLoader for multiple months/years)
 * @param {Object} options - {
 *   startMonth: "December",
 *   endMonth: "February",
 *   startYear: 1980,
 *   endYear: 1989,
 *   dataType: "AvgTempF", // column (e.g., "AvgTempF", "PrecipitationIn", ...)
 *   aggType: "avg" // or: "min", "max", "variance", "median", "sum"
 * }
 * @returns {Object} stateAggregation: { StateName: aggregatedValue, ... }
 */
export function aggregateClimateData(dataRows, options) {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const {
    startMonth, endMonth, startYear, endYear, dataType, aggType
  } = options;

  function getMonthNumber(month, year) {
    return Number(year) * 12 + months.indexOf(month);
  }

  const startNum = getMonthNumber(startMonth, startYear);
  const endNum = getMonthNumber(endMonth, endYear);

  const stateVals = {};
  dataRows.forEach(row => {
    const { Month: month, Year: year, State: state } = row;
    const val = Number(row[dataType]);
    const num = getMonthNumber(month, year);
    if (num >= startNum && num <= endNum && !isNaN(val)) {
      if (!stateVals[state]) stateVals[state] = [];
      stateVals[state].push(val);
    }
  });

  const aggFunc = {
    avg: vals => vals.reduce((a, b) => a + b, 0) / vals.length,
    variance: vals => {
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      return vals.reduce((a, b) => a + (b - mean) ** 2, 0) / (vals.length - 1 || 1);
    },
    min: vals => Math.min(...vals),
    max: vals => Math.max(...vals),
    median: vals => {
      if (vals.length === 0) return null;
      const sorted = [...vals].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return (sorted.length % 2 === 0)
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
    },
    sum: vals => vals.reduce((a, b) => a + b, 0)
  };

  const stateAgg = {};
  for (const state in stateVals) {
    const vals = stateVals[state];
    if (vals.length > 0 && aggFunc[aggType]) {
      stateAgg[state] = aggFunc[aggType](vals);
    }
  }
  return stateAgg;
}
