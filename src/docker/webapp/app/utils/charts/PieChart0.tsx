import * as d3 from "d3";
import { useEffect, useRef } from "react";
import {
  download,
  initTip,
  log,
  renderText,
  renderTip,
  renderTip2,
  schemeDimple,
} from "./charts";
import { unique } from "../slotUtils";

export function PieChart0({
  data,
}: {
  data: {
    category: string;
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
    .domain(data.map((d) => d.category))
    .range(d3.schemeTableau10);

  const pieData = d3
    .pie()
    .sort(null)
    .value((d) => d.count)(data);

  const pieArc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(Math.min(width, height) / 2 - 1);

  // A separate arc generator for labels.
  const labelRadius = pieArc.outerRadius()() * 0.8;
  const labelArc = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

  useEffect(() => {
    const root = d3.select(rootRef.current);
    const svg = d3.select(ref.current);

    svg
      .selectAll()
      .data(pieData)
      .join("path")
      .classed("fadeable", true)
      .attr("series", (d) => d.data.category)
      .attr("d", (d) => pieArc(d))
      .attr("stroke", (d) => color(d.data.category))
      .attr("fill", (d) => color(d.data.category))
      .attr("fill-opacity", 0.8)
      .on("pointerenter", (e, d) => {
        root.selectAll(`.fadeable`).classed("fade", false);
        root
          .selectAll(`.fadeable:not([series='${d.data.category}'])`)
          .classed("fade", true);
      })
      .on("pointermove", (e, d) => {
        renderTip(tip, color(d.data.category), d3.pointer(e), [
          d.data.category,
          d.value,
        ]);
      })
      .on("pointerleave", (e, d) => {
        root.selectAll(`.fadeable`).classed("fade", false);
        tip.attr("display", "none");
      })
      .on("mousedown", (e, d) => window.open("?q=" + d.data.category));

    // Create a new arc generator to place a label close to the edge.
    // The label shows the value if there is enough room.
    svg
      .selectAll()
      .data(pieData)
      .join("text")
      .classed("fadeable", true)
      .attr("style", "pointer-events: none")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "baseline")
      .attr("series", (d) => d.data.category)
      .attr("fill", "currentColor")
      // .attr("fill", (d) => color(d.data.category))
      .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
      .filter((d) => d.endAngle - d.startAngle > 0.25)
      .each(function (d) {
        d3.select(this).call((text) =>
          renderText(text, [d.data.category, d.data.count])
        );
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
        PieChart0
        <svg
          viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
          // width={width}
          // height={height}
          stroke="none"
          fill="none"
          ref={ref}
        ></svg>
        <div>
          {data.slice(0, 12).map((d, i) => (
            <span
              key={i}
              className="fadeable"
              style={{
                display: "inline-block",
                color: color(d.category),
                paddingInline: 2,
              }}
              series={d.category}
              onClick={click}
              onMouseOver={mouseOver}
              onMouseOut={mouseOut}
            >
              {d.category}
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
