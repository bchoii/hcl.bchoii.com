import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { download, initTip, log, renderTip2, schemeDimple } from "./charts";
import { unique } from "../slotUtils";

export function GroupedBarChart0({
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
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 50;
  const marginLeft = 30;

  const x1Scale = d3
    .scaleBand(
      data.map((d) => d.category),
      [marginLeft, width - marginRight]
    )
    .padding(0.2);

  const x2Scale = d3
    .scaleBand(
      data.map((d) => d.series),
      [0, x1Scale.bandwidth()]
    )
    .padding(0.1);

  const yScale = d3.scaleLinear(
    [0, d3.max(data, (d) => d.count)] as [number, number],
    [height - marginBottom, marginTop]
  );

  const grouped = d3.group(
    data,
    (d) => d.category,
    (d) => d.series
  );

  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.series))
    .range(d3.schemeTableau10);

  useEffect(() => {
    const root = d3.select(rootRef.current);
    const svg = d3.select(ref.current);

    const rect = svg
      .selectAll()
      .data(data)
      .join("rect")
      .classed("fadeable", true)
      .attr("series", (d) => d.series)
      .attr("stroke", (d) => color(d.series))
      .attr("fill", (d) => color(d.series))
      .attr("fill-opacity", 0.8)
      .attr("x", (d) => x1Scale(d.category) + x2Scale(d.series))
      .attr("y", (d) => yScale(d.count))
      .attr("height", (d) => yScale(0) - yScale(d.count))
      .attr("width", x2Scale.bandwidth())
      .on("pointerenter", (e, d) => {
        root.selectAll(`.fadeable`).classed("fade", false);
        root
          .selectAll(`.fadeable:not([series='${d.series}'])`)
          .classed("fade", true);
      })
      .on("pointermove", (e, d) => {
        renderTip2(tip, color(d.series), d3.pointer(e), [
          d.series,
          d.category,
          d.count,
        ]);
      })
      .on("pointerleave", (e, d) => {
        root.selectAll(`.fadeable`).classed("fade", false);
        tip.attr("display", "none");
      })
      .on("mousedown", (e, d) => window.open("?q=" + d.key));

    const label = svg
      .selectAll()
      .data(data)
      .join("text")
      .classed("fadeable", true)
      .attr("pointer-events", "none")
      .attr("series", (d) => d.series)
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "hanging")
      .attr(
        "x",
        (d) => x1Scale(d.category) + x2Scale(d.series) + x2Scale.bandwidth() / 2
      )
      .attr("y", (d) => yScale(d.count))
      .text((d) => d.count);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x1Scale))
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
        GroupedBarChart0
        <svg
          viewBox={`0 0 ${width} ${height}`}
          // width={width}
          // height={height}
          stroke="none"
          fill="none"
          ref={ref}
        />
        <div>
          {data
            .map((d) => d.series)
            .filter(unique)
            .slice(0, 12)
            .map((ser) => (
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
