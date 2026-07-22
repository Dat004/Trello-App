import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { setSocketId as setAxiosSocketId } from "@/api/axiosClient";
import SocketContext from "@/context/SocketContext";
import ENV_CONFIG from "@/config/env";

function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Khởi tạo socket connection
    const socketInstance = io(ENV_CONFIG.SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    // Event handlers
    socketInstance.on("connect", () => {
      setSocketId(socketInstance.id);
      setAxiosSocketId(socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      setAxiosSocketId(null);
    });

    socketInstance.on("connect_error", (error) => {
      // Expected on guest pages (no auth cookie yet). Keep retrying quietly;
      // useGlobalRealtimeSync forces connect() after login.
      if (error?.message && error.message !== "Unauthorized") {
        console.error("Connection error:", error);
      }
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const value = {
    socket,
    socketId,
    isConnected,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

