import React from "react";

export default function Legend({ dataType }) {
  let gradientColors, minLabel, maxLabel, unit;

  if (dataType === "AvgTempF") {
    gradientColors = [`rgb(0, 0, 255)`, `rgb(255, 0, 0)`]; // blue to red
    minLabel = "0 °F";
    maxLabel = "100 °F";
    unit = "°F";
  } else if (dataType === "PrecipitationIn") {
    gradientColors = [`rgb(0,0,0)`, `rgb(0,0,255)`]; // black to blue
    minLabel = "0 in";
    maxLabel = "6 in";
    unit = "in";
  } else if (dataType === "HumidityPct") {
    gradientColors = [`rgb(0,0,0)`, `rgb(0,255,0)`]; // black to green
    minLabel = "0 %";
    maxLabel = "100 %";
    unit = "%";
  } else if (dataType === "WindSpeedMph") {
    gradientColors = [`rgb(0,0,0)`, `rgb(255,255,255)`]; // black to white
    minLabel = "0 mph";
    maxLabel = "20 mph";
    unit = "mph";
  }

  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      left: 20,
      width: 200,
      padding: 10,
      backgroundColor: "#fff",
      border: "1px solid black",
      boxShadow: "0 0 5px rgba(0,0,0,0.3)",
      fontSize: "0.9rem",
      zIndex: 1000,
      userSelect: "none",
    }}>
      <div style={{ marginBottom: 4 }}>Legend ({unit})</div>
      <div style={{
        height: "20px",
        background: `linear-gradient(to right, ${gradientColors.join(", ")})`,
      }}/>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: 4,
      }}>
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
