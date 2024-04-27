import * as d3 from "d3";
import { useEffect, useRef } from "react";
import {
  download,
  initTip,
  log,
  renderDateTime,
  renderTip2,
  schemeDimple,
} from "./charts";
import { renderDatetime } from "../utils";
import { addDays } from "date-fns";

export function Timeline1({
  data,
}: {
  data: {
    time: Date;
    series: string;
    count: number;
  }[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ref = useRef<SVGSVGElement>(null);

  // Declare the chart dimensions and margins.
  const width = 600;
  const height = 400;
  const marginTop = 20;
  const marginRight = 10;
  const marginBottom = 50;
  const marginLeft = 30;

  const lines = d3.group(data, (d) => d.series);

  const xScale = d3.scaleTime(
    // [addDays(new Date(), -2), new Date()],
    [d3.min(data.map((d) => d.time))!, new Date()],
    // d3.extent(data.map((d) => d.time)) as [Date, Date],
    [marginLeft, width - marginRight]
  );

  const yScale = d3.scaleSqrt(
    [
      0,
      d3.max(lines, (line) => d3.max(line[1], (point) => point.count))! + 50,
    ] as [number, number],
    [height - marginBottom, marginTop]
  );

  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.series))
    .range(d3.schemeTableau10);

  const line = d3
    .line(
      (d) => xScale(d.time),
      (d) => yScale(d.count)
    )
    .curve(d3.curveMonotoneX);

  const voronoi = d3.Delaunay.from(
    data,
    (d) => xScale(d.time),
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
      .attr("stroke-width", 2)
      .attr("series", (d) => d[0])
      .attr("stroke", (d) => color(d[0]))
      .call((lines_) =>
        lines_
          .append("path")
          .attr("d", (d) => line(d[1].sort((d1, d2) => d1.time - d2.time)))
      )
      .call((lines_) =>
        lines_
          .selectAll()
          .data((d) => d[1])
          .join("circle")
          .attr("cx", (d) => xScale(d.time))
          .attr("cy", (d) => yScale(d.count))
          .attr("r", 2)
      );

    svg.on("pointermove", (e) => {
      renderTip2(tip, "white", d3.pointer(e), [
        renderDatetime(xScale.invert(d3.pointer(e)[0])),
        ~~yScale.invert(d3.pointer(e)[1]),
      ]);
    });

    svg.on("mousedown", async (e, d) => {
      const body = {
        x: renderDatetime(xScale.invert(d3.pointer(e)[0])),
        y: yScale.invert(d3.pointer(e)[1]),
      };
      await fetch("", { method: "post", body: JSON.stringify(body) });
      // location.reload();
    });

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
        Timeline1
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
