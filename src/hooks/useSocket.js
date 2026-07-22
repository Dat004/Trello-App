import { useCallback } from "react";

import { getRoomEvents } from "@/constants/socketEvents";
import { UserSocket } from "@/context/SocketContext";

function useSocket() {
    const { socket, socketId, isConnected } = UserSocket();

    const joinRoom = useCallback((roomType, roomId) => {
        if (!socket || !isConnected) return;

        const { join } = getRoomEvents(roomType);
        socket.emit(join, roomId);
    }, [socket, isConnected]);

    const leaveRoom = useCallback((roomType, roomId) => {
        if (!socket || !isConnected) return;

        const { leave } = getRoomEvents(roomType);
        socket.emit(leave, roomId);
    }, [socket, isConnected]);

    const emit = useCallback((event, data) => {
        if (!socket || !isConnected) return;
        socket.emit(event, data);
    }, [socket, isConnected]);

    const on = useCallback((event, handler) => {
        if (!socket) return;
        socket.on(event, handler);
    }, [socket]);

    const off = useCallback((event, handler) => {
        if (!socket) return;
        socket.off(event, handler);
    }, [socket]);

    return {
        socket,
        socketId,
        isConnected,
        joinRoom,
        leaveRoom,
        emit,
        on,
        off,
    };
}

export default useSocket;
