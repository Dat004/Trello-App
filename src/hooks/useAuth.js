import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { authApi } from "@/api/auth";
import { userApi } from "@/api/user";
import { UserToast } from "@/context/ToastContext";
import { useAuthStore, useUIStore } from "@/store";

export const useAuthInit = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  useEffect(() => {
    const initAuth = async () => {
      const res = await userApi.me();

      if (res.data.success) {
        const user = res.data.data.user;
        setUser(user);

        const userTheme = user?.settings?.appearance?.theme;
        if (userTheme) {
          useUIStore.getState().setTheme(userTheme);
        }

        return;
      }

      clearUser();
    };

    initAuth();
  }, []);
};

export const useAuth = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  const { addToast } = UserToast();
  const duration = 3000;

  const handleSuccess = (user, message, description) => {
    setUser(user);

    addToast({
      type: "success",
      title: message,
      description,
      duration,
    });

    setTimeout(() => {
      navigate("/");
    }, duration);
  };

  const handleError = (message) => {
    addToast({
      type: "error",
      title: message,
      duration,
    });
  };

  const login = async (data) => {
    const res = await authApi.login(data);

    if (res.data.success) {
      handleSuccess(
        res.data.data.user,
        res.data.message,
        "Chúng tôi sẽ tự động chuyển hướng bạn trong vài giây..."
      );

      return;
    }

    handleError(res.data.message);
  };

  const register = async (data) => {
    const res = await authApi.register(data);

    if (res.data.success) {
      handleSuccess(
        res.data.data.user,
        res.data.message,
        "Tự động đăng nhập. Chúng tôi sẽ tự động chuyển hướng bạn trong vài giây..."
      );

      return;
    }

    handleError(res.data.message);
  };

  const logout = async () => {
    const res = await authApi.logout();

    if (res.data.success) {
      clearUser();

      return;
    }

    handleError(res.data.message);
  };

  const googleLogin = async (idToken) => {
    const res = await authApi.googleLogin({ idToken });

    if (res.data.success) {
      handleSuccess(
        res.data.data.user,
        res.data.message,
        "Đăng nhập thành công qua Google. Đang chuyển hướng..."
      );
      return;
    }

    handleError(res.data.message);
  };

  return { login, register, logout, googleLogin };
};
