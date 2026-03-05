import { Check, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

import {
    Badge,
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
    TextArea,
} from "@/Components/UI";
import { UserToast } from "@/context/ToastContext";

function AiTemplateGenerator() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedTemplate, setGeneratedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const { addToast } = UserToast();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      addToast({
        title: "Lỗi",
        description: "Vui lòng nhập mô tả template",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockTemplate = {
      id: Date.now().toString(),
      name: prompt.split(" ").slice(0, 4).join(" "),
      description: prompt,
      lists: ["Backlog", "In Progress", "Review", "Done"],
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
    };

    setGeneratedTemplate(mockTemplate);
    setShowPreview(true);
    setIsLoading(false);
  };

  const handleUseTemplate = () => {
    if (generatedTemplate) {
      addToast({
        type: "success",
        title: `Template "${generatedTemplate.name}" đã được tạo`,
      });
      setOpen(false);
      setPrompt("");
      setGeneratedTemplate(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800 hover:border-purple-400 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base text-purple-900 dark:text-purple-100">
                    Tạo template với AI
                  </CardTitle>
                  <CardDescription className="text-purple-700 dark:text-purple-300 text-xs mt-1">
                    Mô tả ý tưởng của bạn, AI sẽ tạo template
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-700/70 dark:text-purple-300/70 mb-3">
              Chỉ cần mô tả loại board bạn muốn, AI sẽ tạo ra một template phù
              hợp với cấu trúc danh sách và quy trình làm việc tối ưu.
            </p>
            <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700">
              <Sparkles className="h-4 w-4" />
              Tạo template
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Tạo template với AI
          </DialogTitle>
          <DialogDescription>
            Mô tả template mà bạn muốn, AI sẽ giúp bạn tạo ra cấu trúc board
            phù hợp
          </DialogDescription>
        </DialogHeader>

        {!showPreview ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Mô tả template của bạn
              </label>
              <TextArea
                placeholder="Ví dụ: Một board để quản lý dự án phát triển website. Nó cần các cột cho backlog, in progress, review, testing, và deployed..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                disabled={isLoading}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Mô tả càng chi tiết, AI sẽ tạo template càng phù hợp với nhu
                cầu của bạn
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="gap-2 flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Tạo template
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : generatedTemplate ? (
          <div className="space-y-4">
            <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50 dark:bg-purple-950/30">
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`h-12 w-12 rounded-lg ${generatedTemplate.color} flex items-center justify-center`}
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {generatedTemplate.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {generatedTemplate.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Các cột dự kiến:
                </p>
                <div className="flex flex-wrap gap-2">
                  {generatedTemplate.lists.map((list) => (
                    <Badge key={list} variant="secondary" className="text-sm">
                      {list}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPreview(false);
                  setGeneratedTemplate(null);
                }}
              >
                Tạo lại
              </Button>
              <Button
                onClick={handleUseTemplate}
                className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Check className="h-4 w-4" />
                Sử dụng template này
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default AiTemplateGenerator;
