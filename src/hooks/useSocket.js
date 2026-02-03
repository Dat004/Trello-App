import { useCallback } from "react";

import { ROOM_TYPES, getRoomEvents } from "@/constants/socketEvents";
import { UserSocket } from "@/context/SocketContext";

function useSocket() {
    const { socket, socketId, isConnected } = UserSocket();

    // Join room
    const joinRoom = useCallback((roomType, roomId) => {
        if (!socket || !isConnected) {
            console.warn("Không thể join room: Socket không kết nối");
            return;
        }

        const { join } = getRoomEvents(roomType);
        console.log(`Joining ${roomType}: ${roomId}`);
        socket.emit(join, roomId);
    }, [socket, isConnected]);

    // Leave room
    const leaveRoom = useCallback((roomType, roomId) => {
        if (!socket || !isConnected) {
            console.warn("Không thể leave room: Socket không kết nối");
            return;
        }

        const { leave } = getRoomEvents(roomType);
        console.log(`Leaving ${roomType}: ${roomId}`);
        socket.emit(leave, roomId);
    }, [socket, isConnected]);

    // Emit một event tùy chỉnh
    const emit = useCallback((event, data) => {
        if (!socket || !isConnected) {
            console.warn(`Không thể emit ${event}: Socket không kết nối`);
            return;
        }

        socket.emit(event, data);
    }, [socket, isConnected]);

    // Listen một event
    const on = useCallback((event, handler) => {
        if (!socket) {
            console.warn(`Không thể listen to ${event}: Socket không được khởi tạo`);
            return;
        }

        socket.on(event, handler);
    }, [socket]);

    // Remove listener cho một event
    const off = useCallback((event, handler) => {
        if (!socket) {
            console.warn(`Không thể remove listener for ${event}: Socket không được khởi tạo`);
            return;
        }

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
