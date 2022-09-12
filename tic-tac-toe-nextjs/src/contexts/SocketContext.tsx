import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import io, { Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket;
};

interface SocketContextProviderProps {
  children: ReactNode;
}

export const SocketContext = createContext<SocketContextType>({
  socket: {} as Socket,
});

export const SocketProvider = ({ children }: SocketContextProviderProps) => {
  const [socket, setSocket] = useState<Socket>({} as Socket);

  useEffect(() => {
    if (socket && socket.id && socket.connected) {
      return;
    }

    const newSocket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3334",
      {
        transports: ["websocket"],
      }
    );

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const socketContextValue = useMemo(() => {
    return {
      socket,
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socketContextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
