import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const url = "https://echo.hcl.bchoii.com";

export const useSocket = (
  listener: (data: any) => void,
  dependencies: any[]
) => {
  const [socket, setSocket] = useState<Socket>();
  useEffect(() => {
    const socket = io(url, {
      // socket.handshake
      auth: { token: "sockettoken" },
      query: { socketquerykey: "socketqueryvalue" },
    });
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const _listener = (message: string) => {
      const data = JSON.parse(message);
      listener(data);
    };
    socket?.on("ticket", _listener);
    return () => {
      socket?.off("ticket", _listener);
    };
  }, [socket, ...dependencies]);
};
