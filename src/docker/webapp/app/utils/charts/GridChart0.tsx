import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { download, initTip, log, renderTip2, schemeDimple } from "./charts";

export function GridChart0({
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

  const xScale = d3
    .scaleBand(
      data.map((d) => d.category),
      [marginLeft, width - marginRight]
    )
    .padding(0.1);

  const yScale = d3
    .scaleBand(
      data.map((d) => d.series),
      [height - marginBottom, marginTop]
    )
    .padding(0.1);

  const scheme = d3.schemeYlGn[5];

  const color = d3.scaleQuantile(d3.extent(data.map((d) => d.count)), scheme);

  // const color = d3.scaleSequential(
  //   d3.extent(data.map((d) => d.count)),
  //   d3.interpolateYlGn
  // );

  useEffect(() => {
    const root = d3.select(rootRef.current);
    const svg = d3.select(ref.current);

    svg
      .selectAll()
      .data(data)
      .join("rect")
      .classed("fadeable", true)
      .attr("colorgroup", (d) => color(d.count))
      .attr("x", (d) => xScale(d.category))
      .attr("y", (d) => yScale(d.series))
      .attr("stroke", (d) => color(d.count))
      .attr("fill", (d) => color(d.count))
      .attr("fill-opacity", 0.2)
      .attr("width", (d) => xScale.bandwidth())
      .attr("height", (d) => yScale.bandwidth())
      .on("pointerenter", (e, d) => {
        root.selectAll(`.fadeable`).classed("fade", false);
        root
          .selectAll(`.fadeable:not([colorgroup='${color(d.count)}'])`)
          .classed("fade", true);
      })
      .on("pointermove", (e, d) => {
        renderTip2(tip, color(d.count), d3.pointer(e), [
          d.series,
          d.category,
          d.count,
        ]);
      })
      .on("pointerleave", (e, d) => {
        root.selectAll(`.fadeable`).classed("fade", false);
        tip.attr("display", "none");
      });

    svg
      .selectAll()
      .data(data)
      .join("text")
      .classed("fadeable", true)
      .attr("fill", "currentColor")
      .attr("colorgroup", (d) => color(d.count))
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central")
      .attr("pointer-events", "none")
      .attr("x", (d) => xScale(d.category) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.series) + yScale.bandwidth() / 2)
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

  function mouseOver(colorgroup: string) {
    d3.select(rootRef.current)
      .selectAll(`.fadeable:not([colorgroup='${colorgroup}'])`)
      .classed("fade", true);
  }

  function mouseOut(color: string) {
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
        GridChart0
        <svg
          viewBox={`0 0 ${width} ${height}`}
          // width={width}
          // height={height}
          stroke="none"
          fill="none"
          ref={ref}
        />
        <div>
          {scheme.map((s, i) => (
            <span
              key={i}
              className="fadeable"
              colorgroup={s}
              style={{
                display: "inline-block",
                width: xScale.bandwidth(),
                background: s,
              }}
              onMouseOver={() => mouseOver(s)}
              onMouseOut={() => mouseOut(s)}
            >
              &nbsp;
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
