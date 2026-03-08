import { Button, Label, TextArea } from "@/Components/UI";
import { motion } from "framer-motion";
import { Bot, Sparkles, Wand2 } from "lucide-react";

function PromptStep({ prompt, setPrompt, isLoading, onGenerate, onCancel }) {
  return (
    <motion.form 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={onGenerate} 
      className="space-y-6"
    >
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-purple-500" />
          Ý tưởng của bạn là gì?
        </Label>
        <TextArea
          placeholder="Mô tả dự án bạn muốn quản lý... (Ví dụ: Một quy trình chạy chiến dịch Marketing Ecommerce trong 30 ngày)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={6}
          disabled={isLoading}
          className="resize-none text-base border-purple-100 dark:border-purple-900 focus:border-purple-500 focus:ring-purple-500/20 transition-all rounded-xl p-4"
        />
        <div className="flex items-center gap-2 p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg border border-purple-100/50 dark:border-purple-900/50">
          <Bot className="w-4 h-4 text-purple-500 shrink-0" />
          <p className="text-xs text-purple-700/80 dark:text-purple-300/80">
            Mô tả càng chi tiết về các giai đoạn và mục tiêu, AI sẽ tạo cấu trúc càng chính xác.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel}
          className="hover:bg-muted"
        >
          Hủy bỏ
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="gap-2 flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all rounded-xl h-11"
        >
          <Sparkles className="h-4 w-4" />
          Bắt đầu thiết kế với AI
        </Button>
      </div>
    </motion.form>
  );
}

export default PromptStep;
