import { useEffect } from "react";

import { useAuthStore } from "@/store";
import { authApi } from "@/api/user";

const useAuthInit = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  useEffect(() => {
    const initAuth = async () => {
      const res = await authApi.me();
      
      if(res.data.success) {
        setUser(res.data.data.user);

        return;
      }

      clearUser();
    };

    initAuth();
  }, []);
};

export default useAuthInit;
