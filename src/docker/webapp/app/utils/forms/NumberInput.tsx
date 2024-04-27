import { useState } from "react";

export const NumberInput = ({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: number;
}) => {
  const [value, setValue] = useState<number>(defaultValue);
  return (
    <>
      <div className="grid grid-cols-3 m-2">
        <span
          className="border rounded text-center"
          onClick={() => setValue((v) => (v > 0 ? v - 1 : v))}
        >
          -
        </span>
        <span className="text-center">{value}</span>
        <span
          className="border rounded text-center"
          onClick={() => setValue((v) => v + 1)}
        >
          +
        </span>
      </div>
      <input type="hidden" name={name} defaultValue={value}></input>
    </>
  );
};
