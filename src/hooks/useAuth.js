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
      try {
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
      } catch {
        // An expired/missing session is an unauthenticated state.
      } finally {
        if (useAuthStore.getState().loading) {
          clearUser();
        }
      }
    };

    initAuth();
  }, [clearUser, setUser]);
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
    try {
      const res = await authApi.login(data);
      if (!res.data?.success) {
        handleError(res.data?.message || "Đăng nhập thất bại");
        return;
      }
      handleSuccess(
          res.data.data.user,
          res.data.message,
          "Chúng tôi sẽ tự động chuyển hướng bạn trong vài giây..."
        );
    } catch (error) {
      handleError(error.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  const register = async (data) => {
    try {
      const res = await authApi.register(data);
      if (!res.data?.success) {
        handleError(res.data?.message || "Đăng ký thất bại");
        return;
      }
      handleSuccess(
        res.data.data.user,
        res.data.message,
        "Tự động đăng nhập. Chúng tôi sẽ tự động chuyển hướng bạn trong vài giây..."
      );
    } catch (error) {
      handleError(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  const logout = async () => {
    try {
      const res = await authApi.logout();
      if (!res.data?.success) {
        handleError(res.data?.message || "Đăng xuất thất bại");
        return;
      }
      clearUser();
    } catch (error) {
      handleError(error.response?.data?.message || "Đăng xuất thất bại");
    }
  };

  const googleLogin = async (idToken) => {
    try {
      const res = await authApi.googleLogin({ idToken });
      if (!res.data?.success) {
        handleError(res.data?.message || "Đăng nhập Google thất bại");
        return;
      }
      handleSuccess(
        res.data.data.user,
        res.data.message,
        "Đăng nhập thành công qua Google. Đang chuyển hướng..."
      );
    } catch (error) {
      handleError(error.response?.data?.message || "Đăng nhập Google thất bại");
    }
  };

  return { login, register, logout, googleLogin };
};
