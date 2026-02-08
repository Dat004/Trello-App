import useSocket from "@/hooks/useSocket";
import { useEffect } from "react";

/**
 * Debug component để test socket connection
 * Hiển thị connection status và log events
 */
export default function SocketDebug() {
  const { socket, isConnected, socketId } = useSocket();

  useEffect(() => {
    console.log("[SocketDebug] Component mounted");
    console.log("[SocketDebug] isConnected:", isConnected);
    console.log("[SocketDebug] socketId:", socketId);
    console.log("[SocketDebug] socket:", socket);

    if (!socket) {
      console.error("[SocketDebug] Socket is NULL!");
      return;
    }

    console.log("[SocketDebug] isConnected changed to:", isConnected);

    return () => {
      console.log("[SocketDebug] Cleanup");
    };
  }, [socket, isConnected, socketId]);

  const handleDisconnect = () => {
    if (socket) {
      console.log("[SocketDebug] Manual disconnect");
      socket.disconnect();
    }
  };

  const handleConnect = () => {
    if (socket) {
      console.log("[SocketDebug] Manual connect");
      socket.connect();
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg text-xs font-mono">
      <div className="font-bold mb-2">Socket Debug</div>
      <div>Connected: {isConnected ? "✅ YES" : "❌ NO"}</div>
      <div>Socket ID: {socketId || "null"}</div>
      <div>Socket: {socket ? "✅" : "❌"}</div>
      
      <div className="mt-3 space-y-1">
        <button
          onClick={handleDisconnect}
          className="w-full bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Disconnect
        </button>
        <button
          onClick={handleConnect}
          className="w-full bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
        >
          Connect
        </button>
      </div>
    </div>
  );
}
