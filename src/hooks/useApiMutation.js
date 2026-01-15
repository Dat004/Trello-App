import { useState } from "react";
 
import { UserToast } from "@/context/ToastContext";

const useApiMutation = (apiCall, onSuccess, options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = UserToast();

  const {
    successMessage,
    errorMessage,
    showSuccessToast = true,
    showErrorToast = true,
  } = options;

  const mutate = async (...args) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiCall(...args);

      if (response?.data?.success) {
        if (onSuccess) {
          onSuccess(response.data.data, response);
        }

        if (showSuccessToast) {
          addToast({
            type: "success",
            title: successMessage || response.data.message || "Thành công!",
          });
        }

        return { success: true, data: response.data.data };
      } else {
        const errorMsg = response?.data?.message || "Có lỗi xảy ra";
        setError(errorMsg);

        if (showErrorToast) {
          addToast({
            type: "error",
            title: errorMessage || errorMsg,
          });
        }

        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || errorMessage || "Có lỗi xảy ra";
      setError(errorMsg);

      if (showErrorToast) {
        addToast({
          type: "error",
          title: errorMsg,
        });
      }

      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};

export default useApiMutation;
