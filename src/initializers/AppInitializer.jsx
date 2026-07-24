import { useEffect } from "react";

import { wakeBackend } from "@/api/wakeApi";
import { useAuthInit, useFavoritesInit } from "@/hooks";

const AppInitializer = ({ children }) => {
  // Kick Render free instances as soon as the SPA loads (before login clicks).
  useEffect(() => {
    void wakeBackend();
  }, []);

  useAuthInit();
  useFavoritesInit();

  return children;
};

export default AppInitializer;
