import { useState } from "react";
import { Link } from "react-router-dom";

import { Button, Input, Label } from "@/Components/UI";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.signIn(email, password);
    } catch (err) {
      const message = err ? err.message : "Lỗi đăng nhập";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background p-4">
      <section className="w-full max-w-md space-y-8">
        <section className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Đăng nhập</h1>
          <p className="text-muted-foreground">
            Quản lý dự án của bạn hiệu quả
          </p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <section className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2 rounded-md text-sm">
              {error}
            </section>
          )}

          <section className="space-y-2">
            <Label>Email</Label>
            <Input
              required
              id="email"
              type="email"
              value={email}
              placeholder="your@email.com"
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </section>

          <section className="space-y-2">
            <Label>Mật khẩu</Label>
            <Input
              required
              id="password"
              type="password"
              value={password}
              placeholder="Nhập mật khẩu"
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </section>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>

        <section className="text-center">
          <p className="text-muted-foreground text-sm">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              Đăng ký ngay
            </Link>
          </p>
        </section>
      </section>
    </section>
  );
}

export default Auth;
