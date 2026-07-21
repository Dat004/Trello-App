import { Loader2, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { authApi } from "@/api/auth";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/Components/UI";
import paths from "@/config/paths";
import { useAuth, useZodForm } from "@/hooks";
import { resetPasswordSchema } from "@/schemas/passwordSchemas";

function ResetPassword() {
  const { token } = useParams();
  const [isResetting, setIsResetting] = useState(false);
  const [tokenStatus, setTokenStatus] = useState("checking");
  const { resetPassword } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(resetPasswordSchema);

  useEffect(() => {
    if (!token) {
      setTokenStatus("invalid");
      return;
    }

    let cancelled = false;
    setTokenStatus("checking");

    authApi
      .verifyResetToken(token)
      .then((res) => {
        if (cancelled) return;
        setTokenStatus(res?.data?.valid ? "valid" : "invalid");
      })
      .catch(() => {
        if (!cancelled) setTokenStatus("invalid");
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const onSubmit = async (data) => {
    if (!token) return;
    setIsResetting(true);
    await resetPassword({ token, ...data });
    setIsResetting(false);
  };

  if (tokenStatus === "checking") {
    return (
      <main className="min-h-screen login-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Đang kiểm tra liên kết đặt lại mật khẩu...</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (tokenStatus === "invalid") {
    return (
      <main className="min-h-screen login-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Liên kết không hợp lệ</CardTitle>
            <CardDescription>
              Liên kết đặt lại mật khẩu không đúng hoặc đã hết hạn. Vui lòng yêu cầu liên kết mới.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button isLink to={paths.forgotPassword} className="w-full">
              Yêu cầu liên kết mới
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen login-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <LockKeyhole className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Đặt lại mật khẩu</CardTitle>
          <CardDescription>
            Dùng ít nhất 8 ký tự, gồm chữ hoa, chữ thường và chữ số.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu mới</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                disabled={isResetting}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                disabled={isResetting}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isResetting}>
              {isResetting ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default ResetPassword;
