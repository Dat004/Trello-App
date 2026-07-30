import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Button, Input, Label, Separator } from "@/Components/UI";
import BrandLogo from "@/Components/BrandLogo";
import registerSchema from "@/schemas/registerSchema";
import { useAuth, useZodForm } from "@/hooks";

function Register() {
  const [isRegistering, setIsRegistering] = useState(false);
  const registerFormRef = useRef(null);

  const { register: registerAuth } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(registerSchema);

  const handleRegisterAccount = async (data) => {
    setIsRegistering(true);

    await registerAuth(data);

    setIsRegistering(false);
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
                Đăng ký tài khoản mới
              </h3>
            </section>

            <section className="space-y-4">
              <form
                ref={registerFormRef}
                onSubmit={handleSubmit(handleRegisterAccount)}
                className="space-y-2"
              >
                <section>
                  <Label htmlFor="full_name" className="text-xs">
                    Tên đầy đủ
                  </Label>
                  <Input
                    {...register("full_name")}
                    type="text"
                    id="full_name"
                  />
                  {errors.full_name?.message && (
                    <span className="text-xs text-destructive">
                      {errors.full_name.message}
                    </span>
                  )}
                </section>
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
                  <Label htmlFor="password" className="text-xs">
                    Mật khẩu
                  </Label>
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
                <section>
                  <Label htmlFor="confirm_password" className="text-xs">
                    Xác nhận mật khẩu
                  </Label>
                  <Input
                    {...register("confirmPassword")}
                    type="password"
                    id="confirm_password"
                  />
                  {errors.confirmPassword?.message && (
                    <span className="text-xs text-destructive">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </section>
                <Button
                  disabled={isRegistering}
                  type="submit"
                  className="w-full"
                >
                  Đăng ký
                </Button>
              </form>

              <div className="text-center">
                <span className="text-xs">
                  Đã có tài khoản?
                  <Link to="/login" className="ml-1 text-primary underline">
                    Đăng nhập ngay
                  </Link>
                </span>
              </div>
            </section>

            <Separator />

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

export default Register;
