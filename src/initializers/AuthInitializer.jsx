import { useAuthInit } from "@/hooks";

const AuthInitializer = ({ children }) => {
  useAuthInit();
  
  return children;
};

export default AuthInitializer;
