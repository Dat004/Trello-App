import { useState } from "react";

import { UserToast } from "@/context/ToastContext";
import { useAuthStore } from "@/store";
import { userApi } from "@/api/user";

function useUpdateUserSettings() {
  const [isUpdating, setIsUpdating] = useState(false);

  const { addToast } = UserToast();
  const setUser = useAuthStore((s) => s.setUser);

  const updateSettings = async (key, data) => {
    setIsUpdating(true);

    try {
      const res = await userApi.updateSettings({
        [key]: data,
      });

      addToast({
        type: res.data.success ? "success" : "error",
        title: res.data.message,
        duration: 3000,
      });

      if (res.data.success) {
        setUser(res.data.data.user);
      }

      return res;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateSettings, isUpdating };
}

export default useUpdateUserSettings;
