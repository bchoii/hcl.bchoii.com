import { useState } from "react";

export const SelectOne = ({
  name,
  options,
}: {
  name: string;
  options: string[];
}) => {
  const [selected, setSelected] = useState<string>("");
  return (
    <>
      <span className="flex flex-wrap">
        {options.map((option) => (
          <span
            className={`px-2 m-2 border rounded ${
              selected == option ? `active` : ""
            }`}
            onClick={() => setSelected(option)}
          >
            {option}
          </span>
        ))}
      </span>
      <input type="hidden" name={name} defaultValue={selected}></input>
    </>
  );
};
