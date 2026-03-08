import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

function AILoader() {
  const [textIndex, setTextIndex] = useState(0);
  const loadingTexts = [
    "Đang phân tích ý tưởng của bạn...",
    "Thiết kế cấu trúc danh sách tối ưu...",
    "Gợi ý các đầu việc thông minh...",
    "Chuẩn bị nhãn và quy trình...",
    "Hoàn thiện bản thiết kế mẫu..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
            borderRadius: ["20%", "50%", "20%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-20 h-20 bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 blur-xl opacity-30 absolute -inset-2"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="relative w-16 h-16 bg-background rounded-2xl border-2 border-purple-500/20 flex items-center justify-center shadow-2xl"
        >
          <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
        </motion.div>
      </div>
      
      <div className="text-center space-y-2">
        <AnimatePresence mode="wait">
          <motion.p
            key={textIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm font-medium text-purple-700 dark:text-purple-300"
          >
            {loadingTexts[textIndex]}
          </motion.p>
        </AnimatePresence>
        <div className="flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-purple-500"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AILoader;
