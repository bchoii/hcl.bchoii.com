import * as d3 from "d3";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { range } from "../utils";

// https://2019.wattenberger.com/blog/react-and-d3
// https://d3js.org/getting-started#d3-in-react

export function open(url: string) {
  window.open(url);
  focus();

  // const a = document.createElement("a");
  // a.href = url;
  // a.target = "_blank";
  // const ev = new MouseEvent("click", {
  //   ctrlKey: true, // for Windows or Linux
  //   metaKey: true, // for MacOS
  // });
  // a.dispatchEvent(ev);
}

export const download = function (json: any) {
  if (!json) return;
  const filename = `download.json`;
  const blob = new Blob([json], { type: "application/json" });
  const anchor = document.createElement("a");
  const url = window.URL.createObjectURL(blob);
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export function initTip(
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>
) {
  const tip = svg.append("g").attr("style", "pointer-events: none");
  tip.append("rect").attr("fill-opacity", 0.8).attr("fill", "#eee");
  // .attr("filter", "brightness(0.2)");
  tip
    .append("text")
    // .attr("text-anchor", "middle")
    // .attr("alignment-baseline", "hanging")
    .attr("fill", "currentColor");

  return tip;
}

export function renderTip(
  g,
  color: string,
  position: [number, number],
  text: string[]
) {
  g.attr("display", null);
  const textElem = g.select("text").call((g) => renderText(g, text));

  const { x, y, width: w, height: h } = textElem.node().getBBox();

  const padding = { x: 15, y: 10 };

  g.select("rect")
    .attr("stroke", color)
    // .attr("fill", color)
    .attr("x", -padding.x)
    .attr("y", y - padding.y)
    .attr("width", w + 2 * padding.x)
    .attr("height", h + 2 * padding.y);

  g.attr(
    "transform",
    `translate(${position[0] - w - padding.x}, ${
      position[1] - h - y - padding.y
    })`
  );
}

export function renderTip2(
  g,
  color: string,
  position: [number, number],
  lines: string[]
) {
  g.attr("display", null);
  const text = g.select("text").call((g) => renderText(g, lines));

  const { x, y, width: w, height: h } = text.node().getBBox();

  const padding = { x: 15, y: 10 };

  const rect = g
    .select("rect")
    .attr("stroke", color)
    // .attr("fill", color)
    .attr("x", -padding.x)
    .attr("y", y - padding.y)
    .attr("width", w + 2 * padding.x)
    .attr("height", h + 2 * padding.y);

  const tx =
    position[0] < w + 2 * padding.x ? -position[0] + padding.x : -w - padding.x;

  const ty =
    position[1] < h + 2 * padding.y
      ? -position[1] - y + padding.y
      : -h - y - padding.y;

  text.attr("transform", `translate(${tx}, ${ty})`);
  rect.attr("transform", `translate(${tx}, ${ty})`);
  g.select("circle").attr("stroke", color);
  g.attr("transform", `translate(${position[0]}, ${position[1]})`);
}

export const renderText = (
  textElement: d3.Selection<SVGTextElement, unknown, null, undefined>,
  lines: string[]
) => {
  textElement
    .selectAll("tspan")
    .data(lines)
    .join("tspan")
    .attr("x", 0)
    .attr("dy", (d, i) => (i > 0 ? "1em" : ""))
    .attr("font-weight", (d, i) => (i == 0 ? "bold" : ""))
    .text((d) => d);
};

export const log = (...params: any[]) => {
  console.log("LOGGER");
  for (const param of params) {
    console.log(param);
  }
  return params.at(-1);
};

export const schemeDimple = [
  "#80B1D3", // Blue
  "#FB8072", // Red
  "#FDB462", // Orange
  "#B3DE69", // Green
  "#FFED6F", // Yellow
  "#BC80BD", // Purple
  "#8DD3C7", // Turquoise
  "#CCEBC5", // Pale Blue
  "#FFFFB3", // Pale Yellow
  "#BEBADA", // Lavender
  "#FCCDE5", // Pink
  "#D9D9D9", // Grey
];

const renderDate = (date: Date): string => format(date, "M/d:H");

export const renderDateTime = (date: Date): string =>
  format(date, "yyyy-MM-dd HH:mm");

export function TestStackedArea({
  data,
}: {
  data: {
    category: string;
    series: string;
    value: number;
  }[];
}) {
  const ref = useRef<SVGSVGElement>(null);

  // Declare the chart dimensions and margins.
  const width = 800;
  const height = 400;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 50;
  const marginLeft = 100;

  const series = d3
    .stack<typeof data>()
    .keys(d3.union(data.map((d) => d.series)))
    .value(([, D], key) => D.get(key)?.value ?? 0)(
    d3.index(
      data,
      (d) => d.category,
      (d) => d.series
    )
  );

  const xScale = d3
    .scalePoint()
    .domain(data.map((d) => d.category))
    .range([marginLeft, width - marginRight]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1])) ?? 0])
    .rangeRound([height - marginBottom, marginTop]);

  const color = d3
    .scaleOrdinal()
    .domain(series.map((d) => d.key))
    .range(d3.schemeTableau10);

  const area = d3
    .area()
    .x((d) => xScale(d.data[0]) ?? 0)
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]));

  useEffect(() => {
    const svg = d3.select(ref.current);

    const area2 = svg
      .append("g")
      .selectAll()
      .data(series)
      .join("path")
      .attr("fill", (d) => color(d.key))
      .attr("d", area);

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

    const tip = svg
      .append("text")
      .attr("fill", "currentColor")
      // .attr("text-anchor", "end")
      .attr("style", "pointer-events: none");

    area2.on("mousemove", (e, d) => {
      tip.attr("x", d3.pointer(e)[0]).attr("y", d3.pointer(e)[1]).text(d.key);
    });

    area2.on("mouseout", (e, d) => tip.text(""));

    return () => {
      svg.selectAll("*").remove();
    };
  }, [data]);

  return (
    <>
      <div style={{ display: "inline-block", width: "100%", maxWidth: width }}>
        TestStackedArea
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

export function BarChart({ data }: { data: number[] }) {
  const ref = useRef<SVGSVGElement>(null);

  // Declare the chart dimensions and margins.
  const width = 480;
  const height = 320;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 50;
  const marginLeft = 100;

  const xScale = d3
    .scaleBand(range(data.length).map(String), [
      marginLeft,
      width - marginRight,
    ])
    .padding(0.1);

  const yScale = d3.scaleLinear([0, d3.max(data)] as [number, number], [
    height - marginBottom,
    marginTop,
  ]);

  useEffect(() => {
    const svg = d3.select(ref.current);

    const rect = svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("fill", "steelblue")
      .attr("x", (d, i) => xScale(String(i)) ?? 0)
      .attr("y", (d) => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - marginBottom - yScale(d));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(yScale));

    const tip = svg
      .append("text")
      .attr("fill", "currentColor")
      // .attr("text-anchor", "end")
      .attr("style", "pointer-events: none");

    rect.on("mousemove", (e, d) =>
      tip
        .attr("x", d3.pointer(e)[0])
        .attr("y", d3.pointer(e)[1])
        .text(Math.round(d))
    );

    rect.on("mouseout", (e, d) => tip.text(""));

    return () => {
      svg.selectAll("*").remove();
    };
  }, [data]);

  return (
    <>
      BarChart
      <svg
        viewBox={`0 0 ${width} ${height}`}
        // width={width}
        // height={height}
        stroke="none"
        fill="none"
        ref={ref}
      />{" "}
    </>
  );
}

export function LineChart0({
  data,
}: {
  data: {
    category: Date;
    series: string;
    count: number;
  }[];
}) {
  const ref = useRef<SVGSVGElement>(null);

  // Declare the chart dimensions and margins.
  const width = 600;
  const height = 400;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 50;
  const marginLeft = 100;

  const lines = d3.group(data, (d) => d.series);

  const xScale = d3.scalePoint(
    data.map((d) => d.category),
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
    .line()
    .x((d) => xScale(d.category) ?? 0)
    .y((d) => yScale(d.count));

  const bisect = d3.bisector((d) => d.category).center;

  useEffect(() => {
    const svg = d3.select(ref.current);

    const background = svg
      .append("rect")
      .attr("fill", "#0000")
      .attr("x", marginLeft)
      .attr("y", marginTop)
      .attr("width", width - marginLeft - marginRight)
      .attr("height", height - marginTop - marginBottom);

    const lines_ = svg
      .append("g")
      .attr("stroke-width", 2)
      .selectAll()
      .data(lines)
      .join("g")
      .attr("stroke", (d) => color(d[0]));

    lines_.append("path").attr("d", (d) => line(d[1]));

    lines_
      .selectAll()
      .data((d) => d[1])
      .join("circle")
      .attr("cx", (d) => xScale(d.category))
      .attr("cy", (d) => yScale(d.count))
      .attr("r", 2);

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

    const tip = svg
      .append("text")
      .attr("fill", "currentColor")
      // .attr("text-anchor", "end")
      .attr("style", "pointer-events: none");

    lines_.on("pointerenter pointermove", (e, d) => {
      tip.attr("x", d3.pointer(e)[0]).attr("y", d3.pointer(e)[1]).text(d[0]);
    });

    background.on("pointerenter pointermove", (e, d) => {
      const i = bisect(data, xScale.invert(d3.pointer(e)[0]));
    });

    return () => {
      svg.selectAll("*").remove();
    };
  }, [data]);

  return (
    <>
      <div
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
        LineChart0
        <svg
          viewBox={`0 0 ${width} ${height}`}
          // width={width}
          // height={height}
          stroke="none"
          fill="none"
          ref={ref}
        />
        <div>
          {[...lines.keys()].map((key) => (
            <span
              key={key}
              style={{
                display: "inline-block",
                color: color(key),
                paddingInline: 2,
              }}
            >
              {key}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
