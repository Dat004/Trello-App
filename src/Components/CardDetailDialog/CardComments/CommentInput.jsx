import { Send } from "lucide-react";
import { useState } from "react";

import { Button, TextArea } from "@/Components/UI";

function CommentInput({ onSubmit, isLoading, placeholder = "Viết bình luận...", replyTo = null }) {
  const [value, setValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!value.trim()) return;

    onSubmit({
      text: value,
      mentions: [],
    });
    setValue("");
  };

  return (
    <div className="flex gap-2 items-end">
      <TextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        placeholder={placeholder}
        className="min-h-[80px] resize-none"
      />
      <Button
        size="sm"
        onClick={handleSubmit}
        disabled={!value.trim() || isLoading}
        className="mb-1"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default CommentInput;
