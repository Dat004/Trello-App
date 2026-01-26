import { useAuthInit, useWorkspaceInit, useBoardInit } from "@/hooks";

const AppInitializer = ({ children }) => {
  useAuthInit();

  Promise.all([
    useWorkspaceInit(),
    useBoardInit(),
  ])
  
  return children;
};

export default AppInitializer;
