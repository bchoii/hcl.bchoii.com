import { RefObject, useEffect, useRef, useState } from "react";

const useClickOutside = (ref: RefObject<any>, callback: () => void) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

export function Popup({ children, label = "🛈" }: any) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  // useClickOutside(ref, () => setShow(false));
  return (
    <span
      ref={ref}
      onPointerEnter={() => setShow(true)}
      onPointerLeave={() => setShow(false)}
    >
      <span>
        {label}
        {/* › */}
        {/* &#8248; */}
        {show && <span style={{ position: "absolute" }}>{children}</span>}
      </span>
    </span>
  );
}
