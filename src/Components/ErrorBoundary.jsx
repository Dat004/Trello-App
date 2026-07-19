import { Component } from "react";

import { Button } from "@/Components/UI";

/**
 * Last-resort boundary for render/lifecycle failures. API request failures should
 * stay in React Query and be normalized with `getApiErrorMessage`.
 * @extends {Component<{ children: import("react").ReactNode }, { hasError: boolean }>}
 */
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled application error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background p-6">
          <div className="max-w-md space-y-4 text-center">
            <h1 className="text-2xl font-semibold">Đã xảy ra lỗi</h1>
            <p className="text-muted-foreground">
              Ứng dụng gặp sự cố ngoài dự kiến. Hãy tải lại trang để tiếp tục.
            </p>
            <Button onClick={() => window.location.reload()}>Tải lại trang</Button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
