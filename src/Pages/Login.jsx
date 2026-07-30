import { useState } from "react";
import { Link } from "react-router-dom";

import GoogleLoginBtn from "@/Components/GoogleLoginBtn";
import BrandLogo from "@/Components/BrandLogo";
import { Button, Input, Label, Separator } from "@/Components/UI";
import { UserToast } from "@/context/ToastContext";
import loginSchema from "@/schemas/loginSchema";
import { useAuth, useZodForm } from "@/hooks";
import { cn } from "@/lib/utils";

function Auth() {
  const [isLogging, setIsLogging] = useState(false);

  const { addToast } = UserToast();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(loginSchema);

  const loginError = () => {
    addToast({
      type: "error",
      title: "Đăng nhập thất bại",
      duration: 3000,
    });

    setIsLogging(false);
  };

  const handleLoginAccount = async (data) => {
    if (isLogging) return;
    setIsLogging(true);

    try {
      await login(data);
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <section className="h-screen">
      <section className="relative h-full flex items-center justify-center">
        <section className="absolute inset-0 login-bg"></section>
        <section className="relative max-w-[400px] w-full">
          <section className="py-4 px-6 bg-card border border-border sm:shadow-xl sm:py-8 sm:px-10 rounded-sm space-y-6">
            <section className="text-center space-y-3">
              <BrandLogo variant="auth" className="mx-auto" />
              <h3 className="text-base font-semibold text-muted-foreground">
                Đăng nhập để tiếp tục
              </h3>
            </section>

            <form
              onSubmit={handleSubmit(handleLoginAccount)}
              className="space-y-2"
            >
              <fieldset disabled={isLogging} className="space-y-2 border-0 p-0 m-0 min-w-0">
                <section>
                  <Label htmlFor="email" className="text-xs">
                    Email
                  </Label>
                  <Input {...register("email")} type="email" id="email" />
                  {errors.email?.message && (
                    <span className="text-xs text-destructive">
                      {errors.email.message}
                    </span>
                  )}
                </section>
                <section>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs">
                      Mật khẩu
                    </Label>
                    <Link
                      to="/forgot-password"
                      className={cn(
                        "text-xs text-primary hover:underline",
                        isLogging && "pointer-events-none opacity-60"
                      )}
                      tabIndex={isLogging ? -1 : undefined}
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <Input
                    {...register("password")}
                    type="password"
                    id="password"
                  />
                  {errors.password?.message && (
                    <span className="text-xs text-destructive">
                      {errors.password.message}
                    </span>
                  )}
                </section>
                <Button disabled={isLogging} className="w-full mt-4" type="submit">
                  {isLogging ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </fieldset>
            </form>

            <section className="relative">
              <Separator />
              <span className="absolute bg-card px-2 top-1/2 left-1/2 -translate-1/2 text-xs">
                Hoặc
              </span>
            </section>

            <section className="space-y-4">
              {isLogging && (
                <p className="text-center text-xs text-muted-foreground" role="status">
                  Vui lòng đợi — đang xác thực, không thao tác lại.
                </p>
              )}
              <GoogleLoginBtn
                disabled={isLogging}
                onPendingChange={setIsLogging}
                onSuccess={() => setIsLogging(false)}
                onError={loginError}
              />
            </section>

            <div className="text-center">
              <span className="text-xs">
                Bạn chưa có tài khoản?
                <Link
                  to="/register"
                  className={cn(
                    "ml-1 text-primary underline",
                    isLogging && "pointer-events-none opacity-60"
                  )}
                  tabIndex={isLogging ? -1 : undefined}
                >
                  Tạo tài khoản
                </Link>
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground text-center">
              Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với{" "}
              <span className="underline hover:cursor-pointer">
                điều khoản sử dụng{" "}
              </span>
              của chúng tôi
            </p>
          </section>
        </section>
      </section>
    </section>
  );
}

export default Auth;
