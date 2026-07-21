import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/Components/UI";
import paths from "@/config/paths";
import { useAuth, useZodForm } from "@/hooks";
import { forgotPasswordSchema } from "@/schemas/passwordSchemas";

function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { forgotPassword } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(forgotPasswordSchema);

  const onSubmit = async (data) => {
    setIsSending(true);
    const success = await forgotPassword(data);
    setIsSending(false);
    if (success) setSubmitted(true);
  };

  return (
    <main className="min-h-screen login-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Quên mật khẩu?</CardTitle>
          <CardDescription>
            {submitted
              ? "Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi."
              : "Nhập email tài khoản để nhận liên kết đặt lại mật khẩu."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!submitted && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={isSending}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSending}>
                {isSending ? "Đang gửi..." : "Gửi liên kết đặt lại"}
              </Button>
            </form>
          )}

          <Button isLink to={paths.login} variant="ghost" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại đăng nhập
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

export default ForgotPassword;
