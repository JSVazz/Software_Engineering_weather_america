import React from "react";

const GRID_SIZE = 10;

function generateRandomData(size) {
  const data = [];
  for (let i = 0; i < size * size; i++) {
    data.push(Math.floor(Math.random() * 100));
  }
  return data;
}

function getHeatColor(value) {
  const red = Math.min(255, Math.floor((value / 100) * 255));
  const blue = 255 - red;
  return `rgb(${red}, 0, ${blue})`;
}

export default function HeatMap() {
  const data = generateRandomData(GRID_SIZE);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_SIZE}, 30px)`,
        gridGap: "2px",
        margin: "20px",
      }}
    >
      {data.map((value, index) => (
        <div
          key={index}
          title={`Temperature: ${value}`}
          style={{
            width: 30,
            height: 30,
            backgroundColor: getHeatColor(value),
            borderRadius: "4px",
          }}
        />
      ))}
    </div>
  );
}
