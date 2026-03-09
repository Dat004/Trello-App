import { GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";

import { useAuth } from "@/hooks";

const GoogleLoginBtn = ({ onSuccess, onError, onCancel }) => {
  const { googleLogin } = useAuth();

  const handleSuccess = async (response) => {
    await googleLogin(response.credential);
    onSuccess?.();
  };

  // Tích hợp One Tap Login nâng cao
  useGoogleOneTapLogin({
    onSuccess: handleSuccess,
    onError: () => {
      console.error("One Tap Login Failed");
      onError?.();
    },
  });

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.error("Google login button failed");
          onError?.();
        }}
        logo_alignment="left"
        theme="filled_blue"
        shape="square"
        width="100%"
        locale="vi"
      />
    </div>
  );
};

export default GoogleLoginBtn;
