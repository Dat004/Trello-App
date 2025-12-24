import { useEffect } from "react";

import { useAuthStore } from "@/store";
import { userApi } from "@/api/user";

const useAuthInit = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  useEffect(() => {
    const initAuth = async () => {
      const res = await userApi.me();
      
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
