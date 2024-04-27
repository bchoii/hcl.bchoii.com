import { useEffect, useState } from "react";

const color = (value: number, max: number, minHue = 240, maxHue = 0) => {
  const hue = Math.min(value / max, 1) * (maxHue - minHue) + minHue;
  return `oklch(0.6 0.4 ${hue})`;
};

// const color = (value: number, max: number, minHue = 120, maxHue = 0) => {
//   const hue = Math.min(value / max, 1) * (maxHue - minHue) + minHue;
//   return `hsl(${hue}, 100%, 50%)`;
// };

export default function TimeAgo({ date }: { date: string | null | undefined }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const updateSeconds = () => {
      const seconds = date
        ? Math.round((Date.now() - new Date(date).getTime()) / 1000)
        : 0;
      setTime(seconds);
    };

    updateSeconds();

    const timeoutPeriod = time < 60 ? 1000 : 60000;
    // const timeoutPeriod = 1000;
    const timeout = setTimeout(updateSeconds, timeoutPeriod);
    return () => clearTimeout(timeout);
  }, [date, time]);

  if (time < 1) {
    return <>-</>;
  }

  const mins = Math.floor(time / 60);
  const hour = Math.floor(mins / 60);

  const style = { color: color(mins, 120) };

  if (hour > 1) return <span style={style}>{hour} hours</span>;
  if (hour > 0) return <span style={style}>{hour} hour</span>;

  if (mins > 1) return <span style={style}>{mins} mins</span>;
  if (mins > 0) return <span style={style}>{mins} min</span>;

  return <span style={style}>{time} secs</span>;
}
