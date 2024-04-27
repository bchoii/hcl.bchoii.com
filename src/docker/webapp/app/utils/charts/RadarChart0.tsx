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

export function RadarChart0({
  data,
}: {
  data: {
    category: string;
    series: string;
    count: number;
  }[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ref = useRef<SVGSVGElement>(null);

  // Declare the chart dimensions and margins.
  const width = 600;
  const height = 400;

  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.series))
    .range(d3.schemeTableau10);

  const groupedData = d3.group(data, (d) => d.series);

  const maxCount = d3.max(data.map((d) => d.count)) ?? 0;

  const categories = [...d3.union(data.map((d) => d.category))];

  const series = [...d3.union(data.map((d) => d.series))];

  const xScale = d3
    .scalePoint()
    .domain(categories)
    .range([0, 2])
    .padding(0.5)
    .align(0);

  const rScale = d3
    .scaleLinear()
    .domain([0, maxCount])
    .range([0, Math.min(width, height) / 2 - 20]);

  const ticks = d3.ticks(0, maxCount, 5);

  const area = d3
    .areaRadial()
    .curve(d3.curveLinearClosed)
    .angle((d, i) => xScale(d.category) * Math.PI)
    .innerRadius(0)
    .outerRadius((d) => rScale(d.count));

  const radialLines = d3
    .lineRadial()
    .angle((d, i) => xScale(d.category) * Math.PI)
    .radius((d) => rScale(d.count));

  const labelRadius = Math.min(width, height) / 2;
  const labelArc = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

  useEffect(() => {
    const root = d3.select(rootRef.current);
    const svg = d3.select(ref.current);

    svg
      .selectAll()
      .data(ticks)
      .join("circle")
      .attr("stroke", "#333")
      .attr("r", (d) => rScale(d));

    svg
      .selectAll()
      .data(ticks)
      .join("text")
      .attr("fill", "#333")
      // .attr("text-anchor", "middle")
      .attr("x", 5)
      .attr("y", (d) => -rScale(d))
      .text((d) => d);

    // svg
    //   .selectAll()
    //   .data(categories)
    //   .join("text")
    //   .attr("fill", "#333")
    //   .attr("text-anchor", "middle")
    //   .attr(
    //     "transform",
    //     (d) =>
    //       `translate(${labelArc.centroid({
    //         startAngle: xScale(d),
    //         endAngle: xScale(d),
    //       })})`
    //   )
    //   .text((d) => d);

    svg
      .selectAll()
      .data(categories)
      .join("g")
      .attr("fill", "#333")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        (d) =>
          `
          rotate(${xScale(d) * 180})
          translate(0, ${-rScale(maxCount) - 10})
          rotate(${-xScale(d) * 180})
          `
      )
      .append("text")
      .attr("alignment-baseline", "middle")
      .text((d) => d);

    svg
      .selectAll()
      .data(categories)
      .join("path")
      .attr("stroke", "#333")
      .attr("d", (d) =>
        radialLines([
          { category: d, count: 0 },
          { category: d, count: maxCount },
        ])
      );

    svg
      .selectAll()
      .data(groupedData)
      .join("path")
      .classed("fadeable", true)
      .attr("series", (d) => d[0])
      .attr("d", (d) => area(d[1]))
      .attr("stroke", (d) => color(d[0]))
      .attr("fill", (d) => color(d[0]))
      .attr("fill-opacity", 0.8)
      .on("pointerenter", (e, d) => {
        svg.selectAll(`.fadeable`).classed("fade", false);
        svg
          .selectAll(`.fadeable:not([series='${d[0]}'])`)
          .classed("fade", true);
      })
      .on("pointermove", (e, d) => {
        renderTip(tip, color(d[0]), d3.pointer(e), [d[0]]);
      })
      .on("pointerleave", (e, d) => {
        svg.selectAll(`.fadeable`).classed("fade", false);
        tip.attr("display", "none");
      });

    const tip = initTip(svg);

    return () => {
      svg.selectAll("*").remove();
    };
  }, [data]);

  function click(e) {
    window.open("?q=" + e.target.textContent);
  }

  function mouseOver(e) {
    d3.select(rootRef.current)
      .selectAll(`.fadeable:not([series='${e.target.textContent}'])`)
      .classed("fade", true);
  }

  function mouseOut(e) {
    d3.select(rootRef.current).selectAll(`.fadeable`).classed("fade", false);
  }

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
        RadarChart0
        <svg
          viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
          // width={width}
          // height={height}
          stroke="none"
          fill="none"
          ref={ref}
        />
        <div>
          {series.slice(0, 12).map((ser) => (
            <span
              key={ser}
              className="fadeable"
              style={{
                display: "inline-block",
                color: color(ser),
                paddingInline: 2,
              }}
              series={ser}
              onClick={click}
              onMouseOver={mouseOver}
              onMouseOut={mouseOut}
            >
              {ser}
            </span>
          ))}
        </div>
        <button
          className="link"
          style={{ position: "absolute", right: 10, bottom: 10 }}
          onClick={() => download(JSON.stringify(data, null, 2))}
        >
          ⭳
        </button>
      </div>
    </>
  );
}
