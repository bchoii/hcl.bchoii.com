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

export function Line0({
  data,
}: {
  data: {
    category: number;
    series: string;
    count: number;
  }[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ref = useRef<SVGSVGElement>(null);

  // Declare the chart dimensions and margins.
  const width = 600;
  const height = 400;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 50;
  const marginLeft = 30;

  const lines = d3.group(data, (d) => d.series);

  const xScale = d3.scaleLinear(
    d3.extent(data.map((d) => d.category)) as [number, number],
    [marginLeft, width - marginRight]
  );

  const yScale = d3.scaleSqrt(
    [0, d3.max(lines, (line) => d3.max(line[1], (point) => point.count))] as [
      number,
      number
    ],
    [height - marginBottom, marginTop]
  );

  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.series))
    .range(d3.schemeTableau10);

  const line = d3
    .line(
      (d) => xScale(d.category),
      (d) => yScale(d.count)
    )
    .curve(d3.curveMonotoneX);

  const voronoi = d3.Delaunay.from(
    data,
    (d) => xScale(d.category),
    (d) => yScale(d.count)
  ).voronoi([
    marginLeft,
    marginTop,
    width - marginRight,
    height - marginBottom,
  ]);

  useEffect(() => {
    const root = d3.select(rootRef.current);
    const svg = d3.select(ref.current);

    svg
      .selectAll()
      .data(lines)
      .join("g")
      .classed("fadeable", true)
      .attr("series", (d) => d[0])
      .attr("stroke-width", 2)
      .attr("stroke", (d) => color(d[0]))
      .call((lines_) => lines_.append("path").attr("d", (d) => line(d[1])))
      .call((lines_) =>
        lines_
          .selectAll()
          .data((d) => d[1])
          .join("circle")
          .attr("cx", (d) => xScale(d.category))
          .attr("cy", (d) => yScale(d.count))
          .attr("r", 2)
      );

    svg
      .selectAll()
      .data(data)
      .join("path")
      .style("pointer-events", "all")
      .attr("d", (d, i) => voronoi.renderCell(i))
      .on("pointerenter", (e, d) => {
        root
          .selectAll(`.fadeable:not([series='${d.series}'])`)
          .classed("fade", true);
        renderTip2(
          tip,
          color(d.series),
          [xScale(d.category), yScale(d.count)],
          [d.series, d.category, d.count]
        );
      })
      .on("pointerleave", (e, d) => {
        root.selectAll(`.fadeable`).classed("fade", false);
        tip.attr("display", "none");
      })
      .on("mousedown", (e, d) => window.open("?q=" + d.series));

    svg
      .selectAll()
      .data(data)
      .join("text")
      .classed("fadeable", true)
      .attr("pointer-events", "none")
      .attr("series", (d) => d.series)
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("x", (d) => xScale(d.category))
      .attr("y", (d) => yScale(d.count))
      .text((d) => d.count);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(yScale));

    const tip = initTip(svg);
    tip.append("circle").attr("r", 5);

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
        Line0
        <svg
          viewBox={`0 0 ${width} ${height}`}
          // width={width}
          // height={height}
          stroke="none"
          fill="none"
          ref={ref}
        />
        <div>
          {[...lines.keys()].slice(0, 12).map((key) => (
            <span
              key={key}
              className="fadeable"
              style={{
                display: "inline-block",
                color: color(key),
                paddingInline: 2,
              }}
              series={key}
              onClick={click}
              onMouseOver={mouseOver}
              onMouseOut={mouseOut}
            >
              {key}
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
