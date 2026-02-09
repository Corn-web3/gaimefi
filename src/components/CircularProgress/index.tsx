import React from "react";
import ReactECharts from "echarts-for-react";

interface ICircularProgress {
  percentage: number;
  className?: string;
}
const CircularProgress = ({ percentage, className }: ICircularProgress) => {
  const options = {
    series: [
      {
        type: "pie",
        radius: ["70%", "90%"], // Ring width
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "center",
          formatter: `${percentage}%`, // Show percentage in center
          fontSize: 20,
          fontWeight: "bold",
        },
        data: [
          {
            value: percentage,
            itemStyle: {
              color: "#8a7ef9", // Primary color
              borderRadius: "50%", // Make colored part rounder
            },
          },
          {
            value: 100 - percentage,
            itemStyle: {
              color: "#f3f3f3", // Background color
              borderRadius: "50%", // Set border radius for background part too
            },
          },
        ],
        startAngle: 90, // Set start angle, starting from top
        animationType: "expansion", // Animation effect
      },
    ],
  };

  return (
    <div className={`w-[108px] h-[110px] ${className}`}>
      <ReactECharts
        option={options}
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "svg" }} // Use SVG renderer for clearer visual effect
      />
    </div>
  );
};

export default CircularProgress;
