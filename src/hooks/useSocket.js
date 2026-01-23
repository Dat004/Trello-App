import { useCallback } from "react";

import { UserSocket } from "@/context/SocketContext";

function useSocket() {
    const { socket, socketId, isConnected } = UserSocket();

    // Join vào một room cụ thể (ví dụ: card room)
    const joinRoom = useCallback((roomId) => {
        if (!socket || !isConnected) {
            console.warn("Không thể join room: Socket không kết nối");
            return;
        }

        console.log(`Joining room: ${roomId}`);
        socket.emit("join-card", roomId);
    }, [socket, isConnected]);

    // Leave khỏi một room
    const leaveRoom = useCallback((roomId) => {
        if (!socket || !isConnected) {
            console.warn("Không thể leave room: Socket không kết nối");
            return;
        }

        console.log(`Leaving room: ${roomId}`);
        socket.emit("leave-card", roomId);
    }, [socket, isConnected]);

    // Join board room
    const joinBoard = useCallback((boardId) => {
        if (!socket || !isConnected) {
            console.warn("Không thể join board: Socket không kết nối");
            return;
        }

        console.log(`Joining board: ${boardId}`);
        socket.emit("join-board", boardId);
    }, [socket, isConnected]);

    // Leave board room
    const leaveBoard = useCallback((boardId) => {
        if (!socket || !isConnected) {
            console.warn("Không thể leave board: Socket không kết nối");
            return;
        }

        console.log(`Leaving board: ${boardId}`);
        socket.emit("leave-board", boardId);
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
        joinBoard,
        leaveBoard,
        emit,
        on,
        off,
    };
}

export default useSocket;
