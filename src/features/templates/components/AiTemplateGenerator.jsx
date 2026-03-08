import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  MousePointer2,
  Sparkles,
  Wand2
} from "lucide-react";

import CreateBoardStep from "./AiGenerator/CreateBoardStep";
import { slideVariants } from "./AiGenerator/variants";
import PreviewStep from "./AiGenerator/PreviewStep";
import { UserToast } from "@/context/ToastContext";
import PromptStep from "./AiGenerator/PromptStep";
import AILoader from "./AiGenerator/AILoader";
import { aiApi } from "@/api/ai";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/UI";

function AiTemplateGenerator() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("prompt"); // prompt | preview | create
  const [direction, setDirection] = useState(0); // 1 for forward, -1 for back
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedTemplate, setGeneratedTemplate] = useState(null);

  const { addToast } = UserToast();
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!prompt.trim()) {
      addToast({ type: "error", title: "Thiếu mô tả ý tưởng!" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await aiApi.generateTemplate({
        prompt: prompt.trim(),
        language: "vi",
      });

      if (res?.data?.success) {
        setGeneratedTemplate(res.data.data.template);
        if (step !== "preview") {
          setDirection(1);
          setStep("preview");
        }
      } else {
        addToast({ type: "error", title: res?.data?.message || "AI gặp chút sự cố, hãy thử lại!" });
      }
    } catch (err) {
      addToast({ type: "error", title: "Mất kết nối với AI Lab" });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToStep = (nextStep, nextDir) => {
    setDirection(nextDir);
    setStep(nextStep);
  };

  const handleBoardCreated = (board) => {
    setOpen(false);
    resetState();
    navigate(`/board/${board._id}`);
  };

  const resetState = () => {
    setStep("prompt");
    setDirection(0);
    setPrompt("");
    setGeneratedTemplate(null);
    setIsLoading(false);
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) resetState();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200/60 dark:border-purple-800/60 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer group rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:rotate-12 transition-all">
              <Sparkles className="h-16 w-16 text-purple-600" />
            </div>
            
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:rotate-3 transition-transform">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-900 to-pink-700 dark:from-purple-100 dark:to-pink-300">
                    Sáng tạo với AI
                  </CardTitle>
                  <CardDescription className="text-purple-700/80 dark:text-purple-300/80 text-xs font-medium mt-1">
                    Gợi ý quy trình làm việc thông minh
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pt-2">
              <p className="text-sm text-purple-700/60 dark:text-purple-300/60 mb-5 leading-relaxed">
                Mô tả ý tưởng của bạn bằng ngôn ngữ tự nhiên. AI sẽ tự động thiết kế cấu trúc board, tạo nhãn và danh sách công việc phù hợp với thực tế.
              </p>
              <Button className="w-full gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-md border-none group">
                <Wand2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                Thử ngay bây giờ
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] border-none shadow-2xl p-0 overflow-hidden bg-background/95 backdrop-blur-xl rounded-[2rem]">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
        
        <div className="px-8 pt-8 pb-4">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight">
                  {step === "prompt" ? "Thiết kế AI" : step === "preview" ? "Bản thảo mẫu" : "Bước cuối cùng"}
                </DialogTitle>
                <DialogDescription className="text-sm font-medium">
                  {step === "prompt" && "Khởi tạo board chuyên nghiệp chỉ qua vài câu mô tả"}
                  {step === "preview" && "Cơ cấu board cho dự án của bạn đã sẵn sàng"}
                  {step === "create" && "Xác nhận thông tin để khởi tạo không gian làm việc"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="relative overflow-hidden min-h-[400px]">
            <AnimatePresence mode="wait" custom={direction}>
              {isLoading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-2xl"
                >
                  <AILoader />
                </motion.div>
              ) : null}

              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                {step === "prompt" && (
                  <PromptStep
                    prompt={prompt}
                    setPrompt={setPrompt}
                    isLoading={isLoading}
                    onGenerate={handleGenerate}
                    onCancel={() => setOpen(false)}
                  />
                )}

                {step === "preview" && generatedTemplate && (
                  <PreviewStep
                    template={generatedTemplate}
                    onRegenerate={handleGenerate}
                    isRegenerating={isLoading}
                    onUse={() => navigateToStep("create", 1)}
                  />
                )}

                {step === "create" && generatedTemplate && (
                  <CreateBoardStep
                    template={generatedTemplate}
                    onBack={() => navigateToStep("preview", -1)}
                    onCreated={handleBoardCreated}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="px-8 py-4 bg-muted/30 border-t border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="flex -space-x-2">
                {[0,1,2].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-purple-500/20 flex items-center justify-center overflow-hidden">
                    <Bot className="w-3 h-3 text-purple-600" />
                  </div>
                ))}
             </div>
             <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">AI Engine v4.0 Active</span>
          </div>
          <div className="flex items-center gap-2">
              <MousePointer2 className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium">Click to select steps</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AiTemplateGenerator;
