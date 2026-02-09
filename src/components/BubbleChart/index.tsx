import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface BubbleData {
  size: number;
  color?: string;
  text: string;
  x?: number;
  y?: number;
}

interface BubbleChartProps {
  data: BubbleData[];
  width?: number;
  height?: number;
}

const BubbleChart: React.FC<BubbleChartProps> = ({
  data,
  width = 600,
  height = 400,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create node groups to avoid duplicate creation in tick
    const circlesGroup = svg.append("g").attr("class", "circles");
    const textsGroup = svg.append("g").attr("class", "texts");

    const simulation = d3
      .forceSimulation<BubbleData>(data)
      .force("charge", d3.forceManyBody().strength(5))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide<BubbleData>().radius((d: BubbleData) => d.size / 2 + 5)
      )
      .on("tick", () => {
        // Update circle positions
        circlesGroup
          .selectAll<SVGCircleElement, BubbleData>("circle")
          .data(data)
          .join("circle")
          .attr("r", (d) => d.size / 2)
          .attr("fill", (d) => d.color || "steelblue")
          .attr("cx", (d) => d.x ?? 0)
          .attr("cy", (d) => d.y ?? 0);

        // Update text positions
        textsGroup
          .selectAll<SVGTextElement, BubbleData>("text")
          .data(data)
          .join("text")
          .text((d) => d.text)
          .attr("x", (d) => d.x ?? 0)
          .attr("y", (d) => d.y ?? 0)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .style("fill", "#fff")
          .style("font-size", "12px");
      });

    return () => {
      simulation.stop();
      return undefined;
    };
  }, [data, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ border: "1px solid #ccc" }}
    />
  );
};

export default BubbleChart;
