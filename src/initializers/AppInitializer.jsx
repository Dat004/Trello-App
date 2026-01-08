import { useAuthInit, useWorkspaceInit, useBoardInit } from "@/hooks";

const AppInitializer = ({ children }) => {
  useAuthInit();
  useWorkspaceInit();
  useBoardInit();
  
  return children;
};

export default AppInitializer;
