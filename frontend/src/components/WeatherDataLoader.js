import React, { useState, useEffect } from "react";
import Papa from "papaparse";

export default function WeatherDataLoader({ children }) {
  const [allDates, setAllDates] = useState([]); // ["January 2015", ...]
  const [weatherDataByDate, setWeatherDataByDate] = useState({}); // {"January 2015": [...]}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/synthetic_weather_data.csv')
      .then(res => res.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          complete: results => {
            const grouped = {};
            results.data.forEach(row => {
              if (row.Year && row.Month && row.State) {
                const key = `${row.Month} ${row.Year}`;
                if (!grouped[key]) grouped[key] = [];
                grouped[key].push(row);
              }
            });
            const sortedDates = Object.keys(grouped).sort((a, b) => {
              // Sort by year then month
              const months = {
                "January": 1,"February":2,"March":3,"April":4,"May":5,"June":6,
                "July":7,"August":8,"September":9,"October":10,"November":11,"December":12
              };
              const [ma, ya] = a.split(" ");
              const [mb, yb] = b.split(" ");
              return Number(ya) === Number(yb)
                ? months[ma] - months[mb]
                : Number(ya) - Number(yb);
            });
            setAllDates(sortedDates);
            setWeatherDataByDate(grouped);
            setLoading(false);
          }
        });
      });
  }, []);

  if (loading) return <div>Loading weather data...</div>;

  return children(allDates, weatherDataByDate);
}
