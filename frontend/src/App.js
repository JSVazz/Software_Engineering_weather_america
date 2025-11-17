import './App.css';
import React, { useState } from "react";
import USMapBasic from "./components/USMapBasic";
import USMapStates from "./components/USMapStates";
import WeatherDataLoader from "./components/WeatherDataLoader";
import Legend from "./components/Legend";
import { aggregateClimateData } from "./components/AggClimateData.js";

const MAP_HEIGHT = 750;
const MAP_WIDTH = 1600;

const monthsList = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const aggOptions = [
  { value: "avg", label: "Average" },
  { value: "variance", label: "Variance" },
  { value: "min", label: "Minimum" },
  { value: "max", label: "Maximum" },
  { value: "median", label: "Median" },
  { value: "sum", label: "Sum" }
];
const dataTypes = [
  { value: "AvgTempF", label: "Temperature (°F)" },
  { value: "PrecipitationIn", label: "Precipitation (in)" },
  { value: "HumidityPct", label: "Humidity (%)" },
  { value: "WindSpeedMph", label: "Wind Speed (mph)" }
];

export default function App() {
  const [mapIndex, setMapIndex] = useState(0);
  const [startMonth, setStartMonth] = useState("January");
  const [endMonth, setEndMonth] = useState("December");
  const [startYear, setStartYear] = useState(2015);
  const [endYear, setEndYear] = useState(2024);
  const [dataType, setDataType] = useState("AvgTempF");
  const [aggType, setAggType] = useState("avg");
  const [selectedState, setSelectedState] = useState(null);
  const [selectedStateValue, setSelectedStateValue] = useState(null);

  function getHeatColor(value, type) {
    if (type === "PrecipitationIn") {
      const blue = Math.min(255, Math.floor((value / 6) * 255));
      return `rgb(0, 0, ${blue})`;
    }
    if (type === "HumidityPct") {
      const green = Math.min(255, Math.floor((value / 100) * 255));
      return `rgb(0, ${green}, 0)`;
    }
    if (type === "WindSpeedMph") {
      const gray = Math.min(255, Math.floor((value / 20) * 255));
      return `rgb(${gray}, ${gray}, ${gray})`;
    }
    const red = Math.min(255, Math.floor((value / 100) * 255));
    const blue = 255 - red;
    return `rgb(${red}, 0, ${blue})`;
  }

  const handleNextMap = () => setMapIndex((prev) => (prev + 1) % 3);

  const controlStyle = {
    flex: "1 1 18%",
    minWidth: 180,
    display: "flex",
    flexDirection: "column"
  };

  const inputSelectStyle = {
    width: "100%",
    padding: "10px 12px",
    fontSize: 18,
    borderRadius: 6,
    border: "1px solid #bbb",
    marginTop: 6,
    boxSizing: "border-box"
  };

  return (
    <div>
      <h2>Climate America</h2>
      <WeatherDataLoader>
        {(allDates, weatherDataByDate) => {
          const allRows = [];
          const startMonthIdx = monthsList.indexOf(startMonth);
          const endMonthIdx = monthsList.indexOf(endMonth);

          allDates.forEach(date => {
            const [month, year] = date.split(" ");
            const yearNum = parseInt(year);
            const monthIdx = monthsList.indexOf(month);

            const isInRange = (startYear < endYear) || (startYear === endYear && startMonthIdx <= endMonthIdx)
              ? ((yearNum > startYear && yearNum < endYear) ||
                 (yearNum === startYear && monthIdx >= startMonthIdx) ||
                 (yearNum === endYear && monthIdx <= endMonthIdx))
              : ((yearNum > startYear || (yearNum === startYear && monthIdx >= startMonthIdx)) ||
                 (yearNum < endYear || (yearNum === endYear && monthIdx <= endMonthIdx)));

            if (isInRange) {
              weatherDataByDate[date]?.forEach(row => allRows.push(row));
            }
          });

          const stateValueMap = aggregateClimateData(allRows, {
            startMonth, endMonth, startYear, endYear,
            dataType, aggType
          });

          const countryValues = allRows
            .map(row => Number(row[dataType]))
            .filter(val => !isNaN(val));

          let countryWideValue = null;
          if (countryValues.length > 0) {
            switch (aggType) {
              case "avg":
                countryWideValue = countryValues.reduce((a, b) => a + b, 0) / countryValues.length;
                break;
              case "min":
                countryWideValue = Math.min(...countryValues);
                break;
              case "max":
                countryWideValue = Math.max(...countryValues);
                break;
              case "variance":
                const mean = countryValues.reduce((a, b) => a + b, 0) / countryValues.length;
                countryWideValue = countryValues.reduce((a, b) => a + (b - mean) ** 2, 0) / (countryValues.length - 1 || 1);
                break;
              case "median":
                const sorted = [...countryValues].sort((a,b) => a-b);
                const mid = Math.floor(sorted.length / 2);
                countryWideValue = (sorted.length % 2 === 0) ? (sorted[mid-1] + sorted[mid]) / 2 : sorted[mid];
                break;
              case "sum":
                countryWideValue = countryValues.reduce((a,b) => a + b, 0);
                break;
              default:
                countryWideValue = null;
            }
          }

          return (
            <>
              {/* Controls */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
                flexWrap: "wrap",
                gap: 12
              }}>
                <label style={controlStyle}>
                  Start Year:
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={startYear}
                    onChange={e => setStartYear(Number(e.target.value))}
                    style={inputSelectStyle}
                  />
                </label>
                <label style={controlStyle}>
                  End Year:
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={endYear}
                    onChange={e => setEndYear(Number(e.target.value))}
                    style={inputSelectStyle}
                  />
                </label>
                <label style={controlStyle}>
                  Start Month:
                  <select
                    value={startMonth}
                    onChange={e => setStartMonth(e.target.value)}
                    style={inputSelectStyle}>
                    {monthsList.map(m => <option value={m} key={m}>{m}</option>)}
                  </select>
                </label>
                <label style={controlStyle}>
                  End Month:
                  <select
                    value={endMonth}
                    onChange={e => setEndMonth(e.target.value)}
                    style={inputSelectStyle}>
                    {monthsList.map(m => <option value={m} key={m}>{m}</option>)}
                  </select>
                </label>
                <label style={controlStyle}>
                  Aggregation:
                  <select
                    value={aggType}
                    onChange={e => setAggType(e.target.value)}
                    style={inputSelectStyle}>
                    {aggOptions.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
                  </select>
                </label>
                <label style={controlStyle}>
                  Data Type:
                  <select
                    value={dataType}
                    onChange={e => setDataType(e.target.value)}
                    style={inputSelectStyle}>
                    {dataTypes.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
                  </select>
                </label>
              </div>

              {/* Legend */}
              <Legend dataType={dataType} />

              {/* Maps */}
              {mapIndex === 0 && (
                <>
                  <USMapBasic
                    mapWidth={MAP_WIDTH}
                    mapHeight={MAP_HEIGHT}
                    fillColor={countryWideValue !== null ? getHeatColor(countryWideValue, dataType) : "#DDD"}
                  />
                  <div style={{ margin: "16px 0", fontSize: "1.2rem" }}>
                    Nationwide {aggOptions.find(a => a.value === aggType).label} {dataTypes.find(d => d.value === dataType).label}: {countryWideValue?.toFixed(2) ?? "N/A"}
                  </div>
                </>
              )}
              {mapIndex === 1 && (
                <>
                  <USMapStates
                    mapWidth={MAP_WIDTH}
                    mapHeight={MAP_HEIGHT}
                    stateTempMap={stateValueMap}
                    getHeatColor={v => getHeatColor(v, dataType)}
                    onStateClick={(stateName, value) => {
                      setSelectedState(stateName);
                      setSelectedStateValue(value);
                    }}
                  />
                  <div style={{ marginTop: 16, maxHeight: 250, overflowY: "auto" }}>
                    <h3>State {dataTypes.find(d => d.value === dataType).label} ({aggOptions.find(a => a.value === aggType).label}) for Selected Range</h3>
                    <ul>
                      {Object.entries(stateValueMap).map(([state, val]) => (
                        <li key={state}>
                          {state}: {val?.toFixed(2) ?? "N/A"}
                        </li>
                      ))}
                    </ul>

                    {/* Display clicked state info */}
                    {selectedState && (
                      <div style={{
                        position: "fixed",
                        bottom: 20,
                        right: 20,
                        backgroundColor: "white",
                        padding: 10,
                        border: "1px solid black",
                        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                        zIndex: 1000,
                        maxWidth: 250
                      }}>
                        <strong>Selected State:</strong> {selectedState} <br />
                        <strong>{dataTypes.find(d => d.value === dataType).label}:</strong> {selectedStateValue?.toFixed(2)} {dataTypes.find(d => d.value === dataType).label.match(/\((.*)\)/)?.[1] ?? ""}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Map switch button */}
              <button onClick={handleNextMap} style={{ marginTop: 16 }}>
                Switch Map
              </button>
            </>
          );
        }}
      </WeatherDataLoader>
    </div>
  );
}
