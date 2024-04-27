import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { download, initTip, log, renderTip2, schemeDimple } from "./charts";

export function Scatter0({
  data,
}: {
  data: {
    categoryX: number;
    categoryY: number;
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

  const xScale = d3.scaleLinear(
    d3.extent(data.map((d) => d.categoryX)) as [number, number],
    [marginLeft + 20, width - marginRight - 20]
  );

  const yScale = d3.scaleLinear(
    d3.extent(data.map((d) => d.categoryY)) as [number, number],
    [height - marginBottom - 20, marginTop + 20]
  );

  const zScale = d3.scaleSqrt(
    d3.extent(data.map((d) => d.count)) as [number, number],
    [12, 30]
  );

  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.series))
    .range(d3.schemeTableau10);

  const series = d3.group(data, (d) => d.series);

  useEffect(() => {
    const root = d3.select(rootRef.current);
    const svg = d3.select(ref.current);

    svg
      .selectAll()
      .data(data.sort((a, b) => b.count - a.count))
      .join("circle")
      .classed("fadeable", true)
      .attr("series", (d) => d.series)
      .attr("stroke", (d) => color(d.series))
      .attr("fill", (d) => color(d.series))
      .attr("fill-opacity", 0.8)
      .attr("cx", (d) => xScale(d.categoryX))
      .attr("cy", (d) => yScale(d.categoryY))
      .attr("r", (d) => zScale(d.count))
      .on("pointerenter", (e, d) => {
        root.selectAll(`.fadeable`).classed("fade", false);
        root
          .selectAll(`.fadeable:not([series='${d.series}'])`)
          .classed("fade", true);
      })
      .on("pointermove", (e, d) => {
        renderTip2(tip, color(d.series), d3.pointer(e), [
          d.series,
          [d.categoryX, d.categoryY].join(),
          d.count,
        ]);
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
      .attr("series", (d) => d.series)
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central")
      .attr("pointer-events", "none")
      .attr("x", (d) => xScale(d.categoryX))
      .attr("y", (d) => yScale(d.categoryY))
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
        Scatter0
        <svg
          viewBox={`0 0 ${width} ${height}`}
          // width={width}
          // height={height}
          stroke="none"
          fill="none"
          ref={ref}
        />
        <div>
          {[...series].slice(0, 12).map((ser) => (
            <span
              key={ser[0]}
              className="fadeable"
              style={{
                display: "inline-block",
                color: color(ser[0]),
                paddingInline: 2,
              }}
              series={ser[0]}
              onClick={click}
              onMouseOver={mouseOver}
              onMouseOut={mouseOut}
            >
              {ser[0]}
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
