import { useState } from "react";
import { UserPlus, X, Mail } from "lucide-react";

import {
  Input,
  Badge,
  Label,
  TextArea,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./UI";

function InviteMemberDialog({ trigger }) {
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [role, setRole] = useState("member");
  const [message, setMessage] = useState("");

  const addEmail = () => {
    if (
      currentEmail &&
      !emails.includes(currentEmail) &&
      currentEmail.includes("@")
    ) {
      setEmails([...emails, currentEmail]);
      setCurrentEmail("");
    }
  };

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emails.length === 0) return;

    // TODO: Add invitation logic
    console.log("Inviting members:", { emails, role, message });

    // Reset form
    setEmails([]);
    setCurrentEmail("");
    setRole("member");
    setMessage("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full gap-2 leading-1.5">
            <UserPlus className="h-4 w-4" />
            Mời thành viên
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Mời thành viên mới
          </DialogTitle>
          <DialogDescription>
            Mời người khác tham gia workspace và cộng tác trong các dự án.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emails">Email addresses</Label>
            <div className="space-y-2">
              <Input
                id="emails"
                placeholder="Nhập email và nhấn Enter..."
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={addEmail}
              />
              {emails.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {emails.map((email) => (
                    <Badge key={email} variant="secondary" className="gap-1">
                      {email}
                      <button
                        type="button"
                        onClick={() => removeEmail(email)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Vai trò</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">
                  Xem - Chỉ có thể xem bảng
                </SelectItem>
                <SelectItem value="member">
                  Thành viên - Có thể chỉnh sửa bảng
                </SelectItem>
                <SelectItem value="admin">
                  Quản trị - Toàn quyền quản lý
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Tin nhắn (tùy chọn)</Label>
            <TextArea
              id="message"
              placeholder="Thêm tin nhắn cá nhân cho lời mời..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">
              Quyền hạn theo vai trò:
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>
                • <strong>Xem:</strong> Chỉ có thể xem bảng và thẻ
              </li>
              <li>
                • <strong>Thành viên:</strong> Tạo, chỉnh sửa thẻ và bình luận
              </li>
              <li>
                • <strong>Quản trị:</strong> Toàn quyền quản lý workspace và
                thành viên
              </li>
            </ul>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={emails.length === 0}>
              Gửi lời mời ({emails.length})
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default InviteMemberDialog;
