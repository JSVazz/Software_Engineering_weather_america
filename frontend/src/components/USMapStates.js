import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrlStates = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

export default function USMapStates({
  mapWidth,
  mapHeight,
  stateTempMap,
  getHeatColor
}) {
  return (
    <ComposableMap projection="geoAlbersUsa" width={mapWidth} height={mapHeight}>
      <Geographies geography={geoUrlStates}>
        {({ geographies }) =>
          geographies.map(geo => {
            const stateName = geo.properties.name;
            const temp = stateTempMap ? stateTempMap[stateName] : undefined;
            const fillColor = temp !== undefined ? getHeatColor(temp) : "#DDD";

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={fillColor}
                stroke="#000"
                strokeWidth={0.5}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}
