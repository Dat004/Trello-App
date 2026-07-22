import { useRef, useState } from "react";
import { GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/hooks";

const GoogleLoginBtn = ({ onPendingChange, onSuccess, onError, disabled = false }) => {
  const { googleLogin } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const inFlightRef = useRef(false);

  const setPending = (next) => {
    setIsPending(next);
    onPendingChange?.(next);
  };

  const handleSuccess = async (response) => {
    if (inFlightRef.current || disabled) return;
    inFlightRef.current = true;
    setPending(true);

    try {
      const ok = await googleLogin(response.credential);
      if (ok) {
        onSuccess?.();
      }
    } finally {
      inFlightRef.current = false;
      setPending(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
    inFlightRef.current = false;
    setPending(false);
    onError?.();
  };

  useGoogleOneTapLogin({
    onSuccess: handleSuccess,
    onError: handleGoogleError,
    disabled: disabled || isPending,
  });

  // Google renders an iframe — overlays cannot reliably cover it.
  // Swap the button out entirely while auth is in flight.
  if (isPending || disabled) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-muted px-3 text-sm font-medium text-foreground"
      >
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
        {isPending ? "Đang đăng nhập Google..." : "Đang xử lý đăng nhập..."}
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center min-h-10">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleGoogleError}
        logo_alignment="left"
        theme="filled_blue"
        shape="square"
        width="320"
        locale="vi"
        text="signin_with"
      />
    </div>
  );
};

export default GoogleLoginBtn;
