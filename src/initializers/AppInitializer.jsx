import { useAuthInit, useWorkspaceInit } from "@/hooks";

const AppInitializer = ({ children }) => {
  useAuthInit();
  useWorkspaceInit();
  
  return children;
};

export default AppInitializer;
