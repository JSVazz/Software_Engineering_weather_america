import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrlStates = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

export default function USMapBasic({ mapWidth, mapHeight, fillColor = "#DDD" }) {
  return (
    <ComposableMap projection="geoAlbersUsa" width={mapWidth} height={mapHeight}>
      <Geographies geography={geoUrlStates}>
        {({ geographies }) =>
          geographies.map(geo => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={fillColor}
              stroke="none"
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
}
