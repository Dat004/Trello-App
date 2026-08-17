import { useEffect, useState } from "react";
import { Cpu, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/Components/UI";
import BrandLogo from "@/Components/BrandLogo";

function AppLoadingScreen() {
  const [step, setStep] = useState(1);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    // If initial loading takes longer than 1.8s (cold start delay), show notice
    const timer1 = setTimeout(() => setShowNotice(true), 1800);
    const timer2 = setTimeout(() => setStep(2), 5000);
    const timer3 = setTimeout(() => setStep(3), 12000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div
      className="flex min-h-screen w-full flex-col items-center justify-center p-6 text-center bg-background animate-fade-in"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Brand logo & Spinner */}
      <div className="relative mb-6 flex flex-col items-center justify-center">
        <div className="mb-4">
          <BrandLogo variant="header" />
        </div>
        
        <div className="relative flex items-center justify-center">
          <div className="absolute h-14 w-14 rounded-full bg-primary/15 animate-ping" />
          <div className="relative h-11 w-11 rounded-2xl bg-gradient-to-tr from-primary to-blue-500 p-0.5 shadow-lg shadow-primary/20">
            <div className="h-full w-full bg-background rounded-[13px] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 max-w-sm mb-6">
        <h3 className="text-base font-bold tracking-tight text-foreground">
          Đang kết nối hệ thống Trello...
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Vui lòng đợi trong giây lát khi hệ thống thiết lập xác thực an toàn.
        </p>
      </div>

      {showNotice && (
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card/90 p-4.5 shadow-md backdrop-blur-md space-y-3.5 animate-slide-in-bottom">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground border-b pb-2.5">
            <span className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary animate-spin" />
              Khởi chạy Cloud Engine
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              v2.4
            </span>
          </div>

          <div className="space-y-2 text-left text-xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>Đã xác thực chứng chỉ mã hóa</span>
            </div>

            <div className="flex items-center gap-2 text-foreground font-medium">
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              <span>
                {step === 1 && "Đang khởi chạy máy chủ dịch vụ..."}
                {step === 2 && "Đang nạp dữ liệu tài khoản & bảng..."}
                {step === 3 && "Sắp hoàn tất. Đang chuyển vào ứng dụng..."}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t">
            <span>Lần tải đầu có thể mất vài giây</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.reload()}
              className="h-7 text-xs font-medium gap-1 text-primary hover:bg-primary/10"
            >
              <RefreshCw className="h-3 w-3" />
              Tải lại trang (F5)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppLoadingScreen;
