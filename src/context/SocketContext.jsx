import { createContext, useContext } from "react";

const SocketContext = createContext(null);

export function UserSocket() {
  return useContext(SocketContext);
}

export default SocketContext;
