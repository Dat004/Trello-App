import { Bot, ChevronRight, ListTodo, RefreshCw, Tag } from "lucide-react";
import { itemScale, staggerContainer } from "./variants";
import { Badge, Button } from "@/Components/UI";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function PreviewStep({ template, onRegenerate, onUse, isRegenerating }) {
  return (
    <div className="space-y-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="group relative overflow-hidden rounded-2xl border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-white to-purple-50/30 dark:from-background dark:to-purple-950/10 shadow-sm"
      >
        <div className="p-5 flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg text-foreground truncate">{template.name}</h3>
              <Badge className="bg-purple-600 text-white border-none text-[10px] px-2 py-0.5 shadow-sm">
                AI DESIGNED
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{template.description}</p>
          </div>
        </div>

        <div className="h-1 w-full bg-muted overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-full"
          />
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-950/20"
        >
          {template.lists?.map((list, listIdx) => (
            <motion.div 
              key={list._id || listIdx}
              variants={itemScale}
              className="bg-background rounded-xl border border-border/60 p-4 shadow-sm hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                  <h4 className="font-bold text-sm text-foreground">{list.name}</h4>
                </div>
                <Badge variant="secondary" className="bg-muted text-[10px] font-normal">
                  {list.example_cards?.length || 0} cards
                </Badge>
              </div>

              <div className="space-y-2">
                {list.example_cards?.map((card, cardIdx) => (
                  <div
                    key={card._id || cardIdx}
                    className="p-3 bg-card border border-border/40 rounded-lg text-xs hover:shadow-md transition-shadow cursor-default"
                  >
                    <div className="font-semibold text-foreground mb-2">{card.title}</div>

                    <div className="flex flex-wrap gap-1.5">
                      {card.labels?.map((label, lIdx) => (
                        <span
                          key={lIdx}
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full text-white flex items-center gap-1 font-medium",
                            label.color || 'bg-blue-500'
                          )}
                        >
                          <Tag className="h-2 w-2" />
                          {label.name}
                        </span>
                      ))}
                    </div>

                    {card.checklist?.length > 0 && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/30 text-muted-foreground">
                        <ListTodo className="h-3 w-3" />
                        <span className="text-[10px] font-medium">
                          0 / {card.checklist.length} tasks
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-3 pt-2"
      >
        <Button
          type="button"
          variant="outline"
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="gap-2 rounded-xl h-11 border-purple-200 hover:border-purple-400 text-purple-700 dark:text-purple-400"
        >
          <RefreshCw className={cn("h-4 w-4", isRegenerating && "animate-spin")} />
          Thử phương án khác
        </Button>
        <Button
          onClick={onUse}
          className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20 rounded-xl h-11 text-base font-semibold"
        >
          Tiếp tục: Thiết lập Board
          <ChevronRight className="h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
}

export default PreviewStep;
