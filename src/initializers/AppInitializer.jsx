import { useAuthInit, useWorkspaceInit, useBoardInit, useFavoritesInit } from "@/hooks";

const AppInitializer = ({ children }) => {
  useAuthInit();

  Promise.all([
    useWorkspaceInit(),
    useBoardInit(),
    useFavoritesInit(),
  ])
  
  return children;
};

export default AppInitializer;
