import './App.css';
import React, { useState } from "react";
import USMapBasic from "./components/USMapBasic";
import USMapStates from "./components/USMapStates";
import USMapWithStatesCounties from "./components/USMapWithStatesCounties";
import WeatherDataLoader from "./components/WeatherDataLoader";
import Legend from "./components/Legend";

const MAP_HEIGHT = 750;
const MAP_WIDTH = 1600;

export default function App() {
  const [mapIndex, setMapIndex] = useState(0);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [dataType, setDataType] = useState("AvgTempF");
  const [selectedState, setSelectedState] = useState(null);
  const [selectedStateValue, setSelectedStateValue] = useState(null);

  const typeLabel = {
    AvgTempF: "Temperature (°F)",
    PrecipitationIn: "Precipitation (in)",
    HumidityPct: "Humidity (%)",
    WindSpeedMph: "Wind Speed (mph)"
  };
  const unit = {
    AvgTempF: "°F",
    PrecipitationIn: "in",
    HumidityPct: "%",
    WindSpeedMph: "mph"
  };

  function getHeatColor(value, type) {
    if (type === "PrecipitationIn") {
      const blue = Math.min(255, Math.floor((value / 2) * 255));
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

  return (
    <div>
      <h2>Climate America</h2>
      <WeatherDataLoader>
        {(allDates, weatherDataByDate) => {
          const dateCount = allDates.length;
          const dateIdx = Math.max(0, Math.min(selectedDateIndex, dateCount - 1));
          const selectedDate = allDates[dateIdx];
          const dataForDate = weatherDataByDate[selectedDate] || [];

          // Prepare state-to-selected-type map
          const stateValueMap = {};
          dataForDate.forEach(row => {
            stateValueMap[row.State] = Number(row[dataType]);
          });

          // UI Controls
          function setDateBySearch(event) {
            event.preventDefault();
            const search = event.target.elements.dateSearch.value;
            const idx = allDates.indexOf(search);
            if (idx !== -1) setSelectedDateIndex(idx);
          }

          return (
            <>
              {/* Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                <button onClick={() => setSelectedDateIndex(0)} disabled={dateIdx === 0}>&lt;&lt;</button>
                <button onClick={() => setSelectedDateIndex(prev => Math.max(0, prev - 1))} disabled={dateIdx === 0}>&lt;</button>
                <form onSubmit={setDateBySearch}>
                  <input name="dateSearch" list="dateOptions" placeholder="Search" />
                  <datalist id="dateOptions">
                    {allDates.map((d, idx) => <option value={d} key={d}></option>)}
                  </datalist>
                  <button type="submit">Go</button>
                </form>
                <button onClick={() => setSelectedDateIndex(prev => Math.min(dateCount - 1, prev + 1))} disabled={dateIdx === dateCount - 1}>&gt;</button>
                <button onClick={() => setSelectedDateIndex(dateCount - 1)} disabled={dateIdx === dateCount - 1}>&gt;&gt;</button>
                <select value={dataType} onChange={e => setDataType(e.target.value)}>
                  <option value="AvgTempF">Temperature (°F)</option>
                  <option value="PrecipitationIn">Precipitation (in)</option>
                  <option value="HumidityPct">Humidity (%)</option>
                  <option value="WindSpeedMph">Wind Speed (mph)</option>
                </select>
                <span style={{ marginLeft: 16 }}>Current Date: <b>{selectedDate}</b></span>
              </div>

              <Legend dataType={dataType} />
              
              {mapIndex === 0 && (
                <>
                  <USMapBasic
                    mapWidth={MAP_WIDTH}
                    mapHeight={MAP_HEIGHT}
                    fillColor={dataForDate.length > 0 ? getHeatColor(Number(dataForDate[0][dataType]), dataType) : "#DDD"}
                  />
                  <div style={{ margin: "16px 0", fontSize: "1.2rem" }}>
                    {selectedDate}
                    <br />
                    {`${typeLabel[dataType]} Example: ${Number(dataForDate[0]?.[dataType] || 0).toFixed(2)} ${unit[dataType]}`}
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
                    <h3>
                      State {typeLabel[dataType]} for {selectedDate}
                    </h3>
                    <ul>
                      {dataForDate.map(row => (
                        <li key={row.State}>
                          {row.State}: {Number(row[dataType]).toFixed(2)} {unit[dataType]}
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
                        <strong>{typeLabel[dataType]}:</strong> {selectedStateValue?.toFixed(2)} {unit[dataType]}
                      </div>
                    )}
                  </div>
                </>
              )}
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
