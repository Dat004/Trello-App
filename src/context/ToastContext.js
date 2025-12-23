import { createContext, useContext } from "react";

const ToastContext = createContext();

export function UserToast() {
  return useContext(ToastContext);
}

export default ToastContext;