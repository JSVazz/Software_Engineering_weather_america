import React from "react";

export default function Legend({ dataType, minValue, maxValue, getHeatColor, steps = 5 }) {
  // Prevent zero range to avoid division errors
  let effectiveMax = maxValue;
  if (minValue === maxValue) {
    effectiveMax = minValue + 1;
  }

  // Calculate labels and colors for each step
  const stepSize = (effectiveMax - minValue) / steps;
  const labels = [];
  const colors = [];

  for (let i = 0; i <= steps; i++) {
    const value = minValue + i * stepSize;
    labels.push(value);
    const normalized = (value - minValue) / (effectiveMax - minValue);
    colors.push(getHeatColor(normalized * 100, dataType));
  }

  // Construct CSS gradient string
  const gradientStyle = `linear-gradient(to right, ${colors.join(", ")})`;

  // Determine unit from dataType
  const unitMap = {
    AvgTempF: "°F",
    PrecipitationIn: "in",
    HumidityPct: "%",
    WindSpeedMph: "mph"
  };
  const unit = unitMap[dataType] || "";

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
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{ marginBottom: 4 }}>Legend ({unit})</div>
      <div style={{ height: "20px", background: gradientStyle }} />
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: 4,
        fontWeight: "bold"
      }}>
        <span>{labels[0].toFixed(2)}</span>
        <span>{labels[labels.length - 1].toFixed(2)}</span>
      </div>
    </div>
  );
}
