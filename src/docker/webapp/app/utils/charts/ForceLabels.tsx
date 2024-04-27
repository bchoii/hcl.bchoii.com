import * as d3 from "d3";
import { useEffect, useRef } from "react";
import {
  download,
  initTip,
  log,
  renderTip,
  renderTip2,
  schemeDimple,
} from "./charts";
import { unique } from "../slotUtils";
import { range } from "../utils";

// https://blocks.roadtolarissa.com/ZJONSSON/1691430

export function ForceLabels() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ref = useRef<SVGSVGElement>(null);

  const nodes = range(24).flatMap((d) => [
    {
      index: d,
      label: `label-${d}`,
      x: Math.random(),
      y: Math.random(),
    },
  ]);

  const links = range(24).flatMap((d) => [
    {
      source: d,
      target: (d + 1) % 10,
    },
  ]);

  // Declare the chart dimensions and margins.
  const width = 600;
  const height = 400;

  const xScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([-width / 2, width / 2]);
  const yScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([height / 2, -height / 2]);

  useEffect(() => {
    const root = d3.select(rootRef.current);
    const svg = d3.select(ref.current);

    const label = svg
      .selectAll()
      .data(nodes)
      .join("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "currentColor")
      .attr("opacity", 0.2)
      .attr("x", (d) => xScale(d.x))
      .attr("y", (d) => yScale(d.y))
      .text((d) => d.label);

    const node = svg
      .selectAll()
      .data(nodes)
      .join("circle")
      .attr("fill", "green")
      .attr("r", 5)
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y));

    const link = svg
      .selectAll()
      .data(links)
      .join("line")
      .attr("stroke", "#888")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", 1);

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links))
      .force("charge", d3.forceManyBody().strength(-50))
      .force("center", d3.forceCenter(width / 2, height / 2))
      // .force("r", d3.forceRadial(10, 0, 0))
      .on("tick", tick);

    function tick() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      label.attr("x", (d) => d.x).attr("y", (d) => d.y);
    }

    return () => {
      svg.selectAll("*").remove();
    };
  }, []);

  return (
    <>
      <div
        ref={rootRef}
        style={{
          display: "inline-block",
          width: "100%",
          maxWidth: width,
          position: "relative",
          border: "1px solid #ccc",
          padding: 20,
          borderRadius: 5,
          verticalAlign: "top",
          overflow: "clip",
          margin: 5,
          cursor: "default",
        }}
      >
        ForceLabels
        <svg
          viewBox={`0 0 ${width} ${height}`}
          // width={width}
          // height={height}
          stroke="none"
          fill="none"
          ref={ref}
        />
      </div>
    </>
  );
}
