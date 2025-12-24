import { useNavigate } from "react-router-dom";

import { UserToast } from "@/context/ToastContext";
import { useAuthStore } from "@/store";
import { authApi } from "@/api/auth";

export const useAuth = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

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

  return { login, register };
};

export default useAuth;
