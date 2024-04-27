import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useTimeout = (
  callback: () => void,
  ms: number,
  dependencies: any[]
) => {
  const id = Math.random();
  useEffect(() => {
    const timeout = setTimeout(callback, ms);
    return () => {
      clearTimeout(timeout);
    };
  }, dependencies);
};
