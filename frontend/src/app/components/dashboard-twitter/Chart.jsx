"use client";

import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = () => {
  // Sample data for a line chart
  const lineData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "User Growth",
        data: [65, 59, 80, 81, 56],
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  // Sample data for a bar chart
  const barData = {
    labels: ["North", "South", "East", "West"],
    datasets: [
      {
        label: "Revenue",
        data: [12, 19, 3, 5],
        backgroundColor: [
          "rgba(255,99,132,0.2)",
          "rgba(54,162,235,0.2)",
          "rgba(255,206,86,0.2)",
          "rgba(75,192,192,0.2)",
        ],
        borderColor: [
          "rgba(255,99,132,1)",
          "rgba(54,162,235,1)",
          "rgba(255,206,86,1)",
          "rgba(75,192,192,1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Interactive Chart" },
    },
  };

  return (
    <div>
      <h2>Line Chart</h2>
      <Line data={lineData} options={options} />
      <h2>Bar Chart</h2>
      <Bar data={barData} options={options} />
    </div>
  );
};

export default ChartComponent;
