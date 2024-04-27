import { useState } from "react";

export const SelectMany = ({
  name,
  options,
  max,
}: {
  name: string;
  options: string[];
  max?: number;
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  function toggle(option: string) {
    if (selected.includes(option)) {
      setSelected(selected.filter((s) => s != option));
    } else {
      if (max && selected.length >= max) {
        setSelected([...selected.slice(1 - max), option]);
      } else {
        setSelected([...selected, option]);
      }
    }
  }
  return (
    <>
      <span className="flex flex-wrap">
        {options.map((option) => (
          <span
            className={`px-2 m-2 border rounded ${
              selected.includes(option) ? `active` : ""
            }`}
            onClick={() => toggle(option)}
          >
            {option}
          </span>
        ))}
      </span>
      {selected.map((s, index) => (
        <input key={index} type="hidden" name={name} defaultValue={s}></input>
      ))}
    </>
  );
};
