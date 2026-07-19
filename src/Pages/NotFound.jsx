import { Button } from "@/Components/UI";

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="space-y-4 text-center">
        <p className="text-6xl font-bold text-primary">404</p>
        <h1 className="text-2xl font-semibold">Không tìm thấy trang</h1>
        <p className="text-muted-foreground">Đường dẫn này không tồn tại hoặc đã được di chuyển.</p>
        <Button isLink to="/">Về trang chủ</Button>
      </div>
    </main>
  );
}

export default NotFound;
