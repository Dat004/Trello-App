import {
  LockKeyhole,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import {
  Button,
  Separator,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Card,
  Badge,
  Input,
  Label,
} from "@/Components/UI";
import { useAuth, useZodForm } from "@/hooks";
import { changePasswordSchema } from "@/schemas/passwordSchemas";
import { useAuthStore } from "@/store";

function AccountTab() {
  const [isChanging, setIsChanging] = useState(false);
  const user = useAuthStore((state) => state.user);
  const hasPasswordProvider = user?.providers?.includes("password");
  const { changePassword } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(changePasswordSchema);

  const onSubmit = async (data) => {
    setIsChanging(true);
    await changePassword(data);
    setIsChanging(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bảo mật tài khoản</CardTitle>
          <CardDescription>Quản lý mật khẩu và bảo mật</CardDescription>
        </CardHeader>
        <section className="px-4 sm:px-6">
          <Separator />
        </section>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full space-y-4 rounded-lg border p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <LockKeyhole className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">
                    {hasPasswordProvider ? "Đổi mật khẩu" : "Thiết lập mật khẩu"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Dùng ít nhất 8 ký tự, gồm chữ hoa, chữ thường và chữ số.
                  </p>
                </div>
              </div>

              {hasPasswordProvider && (
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    disabled={isChanging}
                    {...register("currentPassword")}
                  />
                  {errors.currentPassword && (
                    <p className="text-xs text-destructive">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  disabled={isChanging}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  disabled={isChanging}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Sau khi đổi mật khẩu, bạn sẽ cần đăng nhập lại trên mọi thiết bị.
              </p>

              <Button type="submit" disabled={isChanging}>
                {isChanging ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </Button>
            </form>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="text-sm md:text-base font-medium">
                  Xác thực 2 bước
                </h4>
                <p className="text-sm text-muted-foreground">
                  Tăng cường bảo mật tài khoản
                </p>
              </div>
              <Badge variant="outline">Chưa kích hoạt</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="text-sm md:text-base font-medium">
                  Phiên đăng nhập
                </h4>
                <p className="text-sm text-muted-foreground">
                  Quản lý các thiết bị đã đăng nhập
                </p>
              </div>
              <Button variant="outline" size="sm" disabled title="Tính năng chưa được hỗ trợ">
                Chưa hỗ trợ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Vùng nguy hiểm</CardTitle>
          <CardDescription>Các hành động không thể hoàn tác</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
            <div>
              <h4 className="text-sm md:text-base font-medium">
                Xóa tài khoản
              </h4>
              <p className="text-sm text-muted-foreground">
                Xóa vĩnh viễn tài khoản và tất cả dữ liệu
              </p>
            </div>
            <Button variant="destructive" size="sm" className="gap-2" disabled title="Tính năng chưa được hỗ trợ">
              <Trash2 className="h-4 w-4" />
              Xóa tài khoản (sắp có)
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default AccountTab;
