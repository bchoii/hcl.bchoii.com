import { useState, useEffect } from "react";

// const useStorage = (storageEngine: Storage, key: string) => {
//   const [value, setValue] = useState(storageEngine.getItem(key));
//   useEffect(() => storageEngine.setItem(key, value ?? ""), [value]);
//   return [value ?? "", setValue] as [string, typeof setValue];
// };

// export const useLocalStorage = (key: string) =>
//   typeof document == "undefined" ? useState("") : useStorage(localStorage, key);

// export const useLocalStorage = (key: string) => useStorage(localStorage, key);

export const useLocalStorage = (key: string, defaultValue: string = "") => {
  const [state, setState] = useState(defaultValue);

  useEffect(() => {
    const item = localStorage.getItem(key);
    setState(item ?? defaultValue);
  }, []);

  const setValue = (value: string) => {
    localStorage.setItem(key, value);
    setState(value);
  };

  return [state, setValue] as [string, typeof setState];
};
