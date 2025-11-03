import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrlStates = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const geoUrlCounties = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

export default function USMapWithStatesCounties({ mapWidth, mapHeight }) {
  return (
    <ComposableMap projection="geoAlbersUsa" width={mapWidth} height={mapHeight}>
      <Geographies geography={geoUrlCounties}>
        {({ geographies }) =>
          geographies.map(geo => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#DDD"
              stroke="#999"
              strokeWidth={1.5}
            />
          ))
        }
      </Geographies>
      <Geographies geography={geoUrlStates}>
        {({ geographies }) =>
          geographies.map(geo => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="none"
              stroke="#000"
              strokeWidth={0.5}
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
}
