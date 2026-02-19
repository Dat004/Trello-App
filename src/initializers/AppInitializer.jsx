import { useAuthInit, useFavoritesInit } from "@/hooks";

const AppInitializer = ({ children }) => {
  useAuthInit();
  useFavoritesInit();
  
  return children;
};

export default AppInitializer;
