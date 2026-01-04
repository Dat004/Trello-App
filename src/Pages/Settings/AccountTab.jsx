import {
  Lock,
  Trash2,
} from "lucide-react";

import {
  Button,
  Separator,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Card,
  Badge,
} from "@/Components/UI";

function AccountTab() {
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
            <Button className="gap-2 h-9">
              <Lock className="h-4 w-4" />
              Đổi mật khẩu
            </Button>

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
              <Button variant="outline" size="sm">
                Xem chi tiết
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
            <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Xóa tài khoản
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default AccountTab;
