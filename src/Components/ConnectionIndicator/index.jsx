import { CloudOff, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import useSocket from "@/hooks/useSocket";
import { cn } from "@/lib/utils";

export default function ConnectionIndicator() {
  const { isConnected } = useSocket();
  const { isOnline } = useNetworkStatus();
  const [show, setShow] = useState(false);
  const [wasDisconnected, setWasDisconnected] = useState(false);

  // Determine current state
  const getState = () => {
    if (!isOnline) return 'offline';
    if (!isConnected) return 'reconnecting';
    return 'connected';
  };

  const state = getState();

  // State configurations
  const stateConfig = {
    // 🔴 Offline: Không có mạng (navigator.onLine = false)
    offline: {
      icon: CloudOff,
      color: 'bg-red-500/90',
      text: 'Không có mạng',
      pulse: false,
      autoHide: false,
    },
    // 🟡 Reconnecting: Socket disconnect nhưng có mạng
    reconnecting: {
      icon: WifiOff,
      color: 'bg-amber-500/90',
      text: 'Đang kết nối lại...',
      pulse: true,
      autoHide: false,
    },
    // 🟢 Connected: Tất cả OK
    connected: {
      icon: Wifi,
      color: 'bg-green-500/90',
      text: 'Đã kết nối',
      pulse: false,
      autoHide: true,
      autoHideDelay: 3000,
    },
  };

  const config = stateConfig[state];
  const Icon = config.icon;

  // Show/hide logic
  useEffect(() => {
    if (state === 'offline' || state === 'reconnecting') {
      // Mất kết nối → hiện ngay
      setShow(true);
      setWasDisconnected(true);
    } else if (state === 'connected' && wasDisconnected) {
      // Kết nối lại → hiện rồi ẩn sau delay
      setShow(true);
      if (config.autoHide) {
        const timer = setTimeout(() => {
          setShow(false);
          setWasDisconnected(false);
        }, config.autoHideDelay);

        return () => clearTimeout(timer);
      }
    } else if (state === 'connected' && !wasDisconnected) {
      // Connected từ đầu → không hiện
      setShow(false);
    }
  }, [state, wasDisconnected, config.autoHide, config.autoHideDelay]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 fade-in">
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg px-4 py-2 shadow-lg backdrop-blur-sm text-white transition-all",
          config.color
        )}
      >
        <Icon className={cn(
          "h-4 w-4",
          config.pulse && "animate-pulse"
        )} />
        <span className="text-sm font-medium">{config.text}</span>
      </div>
    </div>
  );
}
