import { useState } from "react"
import { Link } from "react-router-dom";
import { Loader2, Lock, Mail, MessageSquare, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

import { workspaceApi } from "@/api/workspace";
import { useApiMutation } from "@/hooks";
import {
  Button,
  TextArea,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/UI";

function RequestWorkspaceAccessDialog({
  workspace,
  open,
  onOpenChange,
  hasPendingRequest = false,
  requested_at,
}) {
  const [message, setMessage] = useState("")
  const [sendedRequest, setSendedRequest] = useState(false)

  const { mutate: sendRequest, isLoading } = useApiMutation(
    (data) => workspaceApi.joinWorkspace(workspace._id, data),
    () => {
      setSendedRequest(true);
    }
  );

  const handleSendRequest = async (e) => {
    e.preventDefault();

    sendRequest({ message });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Lock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <DialogTitle className="text-lg">Yêu cầu truy cập Workspace</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-base mt-2">
            Bạn chưa là thành viên của workspace <span className="font-semibold text-foreground">"{workspace.name}"</span>. 
            Hãy gửi yêu cầu để gia nhập workspace này.
          </DialogDescription>
        </DialogHeader>
        {hasPendingRequest || sendedRequest ? (
          <div className="space-y-4 py-4">
            <div className="flex gap-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
              <Clock className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  Yêu cầu đang chờ xác nhận
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                  Bạn đã gửi yêu cầu truy cập workspace <span className="font-semibold">"{workspace.name}"</span> trước đó. Workspace owner/admin sẽ xem xét yêu cầu của bạn trong phần "Chờ xác nhận".
                </p>
                {(sendedRequest || requested_at) && (
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Gửi lúc: {formatDistanceToNow(sendedRequest ? new Date() : new Date(requested_at), { addSuffix: true, locale: vi })}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <h4 className="text-sm font-semibold text-foreground">Tiếp theo là gì?</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">1.</span>
                  <span>Workspace owner/admin sẽ xem xét yêu cầu của bạn</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">2.</span>
                  <span>Bạn sẽ nhận được thông báo khi yêu cầu được chấp nhận</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">3.</span>
                  <span>Nếu bị từ chối, bạn có thể liên hệ workspace owner/admin để biết thêm lý do</span>
                </li>
              </ul>
            </div>

            <Button
              type="button"
              className="w-full"
            >
              <Link to="/workspaces">Quay lại</Link>
            </Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSendRequest}>
            {/* Message Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Lời nhắn (tùy chọn)
              </label>
              <TextArea
                placeholder="Cho mình biết lý do bạn muốn gia nhập workspace này..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Viết một tin nhắn ngắn để giúp admin hiểu rõ hơn về yêu cầu của bạn
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
              >
                <Link to="/workspaces">Quay lại</Link>
              </Button>
              <Button
                type="submit"
                disabled={isLoading || message.trim().length === 0}
                className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Gửi yêu cầu
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Info Box */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 Admin workspace sẽ nhận được yêu cầu của bạn và có thể chấp nhận hoặc từ chối trong phần "Chờ xác nhận"
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RequestWorkspaceAccessDialog;
