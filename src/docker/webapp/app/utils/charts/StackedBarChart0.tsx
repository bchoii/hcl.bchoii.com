import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { download, initTip, log, renderTip2, schemeDimple } from "./charts";

export function StackedBarChart0({
  data,
  categories,
}: {
  data: {
    category: string;
    series: string;
    count: number;
  }[];
  categories?: string[];
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

  const series = d3
    .stack()
    .keys(d3.union(data.map((d) => d.series)))
    .value(([, D], key) => D.get(key)?.count)(
    d3.index(
      data,
      (d) => d.category,
      (d) => d.series
    )
  );

  const xScale = d3
    .scaleBand(categories ?? data.map((d) => d.category), [
      marginLeft,
      width - marginRight,
    ])
    .padding(0.1);

  const yScale = d3.scaleSqrt(
    [0, d3.max(series, (d) => d3.max(d, (d) => d[1]))] as [number, number],
    [height - marginBottom, marginTop]
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
      .data(series)
      .join("g")
      .classed("fadeable", true)
      .attr("series", (d) => d.key)
      .attr("stroke", (d) => color(d.key))
      .attr("fill", (d) => color(d.key))
      .attr("fill-opacity", 0.8)
      .selectAll()
      .data((D) => D.map((d) => ((d.key = D.key), d)))
      .join("rect")
      .attr("x", (d) => xScale(d.data[0]))
      .attr("y", (d) => yScale(d[1]))
      .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .on("pointerenter", (e, d) => {
        root.selectAll(`.fadeable`).classed("fade", false);
        root
          .selectAll(`.fadeable:not([series='${d.key}'])`)
          .classed("fade", true);
      })
      .on("pointermove", (e, d) => {
        renderTip2(tip, color(d.key), d3.pointer(e), [
          d.key,
          d.data[0],
          d.data[1].get(d.key).count,
          // d[1] - d[0],
        ]);
      })
      .on("pointerleave", (e, d) => {
        root.selectAll(`.fadeable`).classed("fade", false);
        tip.attr("display", "none");
      })
      .on("mousedown", (e, d) => window.open("?q=" + d.key));

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
        StackedBarChart0
        <svg
          viewBox={`0 0 ${width} ${height}`}
          // width={width}
          // height={height}
          stroke="none"
          fill="none"
          ref={ref}
        />
        <div>
          {series.slice(0, 12).map((ser) => (
            <span
              key={ser.key}
              className="fadeable"
              style={{
                display: "inline-block",
                color: color(ser.key),
                paddingInline: 2,
              }}
              series={ser.key}
              onClick={click}
              onMouseOver={mouseOver}
              onMouseOut={mouseOut}
            >
              {ser.key}
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
