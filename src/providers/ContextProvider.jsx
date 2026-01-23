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
    const socketInstance = io(ENV_CONFIG.API_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    // Event handlers
    socketInstance.on("connect", () => {
      console.log("Connected:", socketInstance.id);

      setSocketId(socketInstance.id);
      setAxiosSocketId(socketInstance.id); // Sync với axios
      setIsConnected(true);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);

      setIsConnected(false);
      setAxiosSocketId(null); // Clear axios socketId
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    setSocket(socketInstance);

    // Cleanup khi unmount
    return () => {
      console.log("Cleaning up connection");
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

