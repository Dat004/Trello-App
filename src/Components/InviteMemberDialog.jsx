import { Loader2, Mail, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { useZodForm } from "@/hooks";
import { inviteSchema } from "@/schemas/inviteSchema";

import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TextArea,
} from "./UI";

function InviteMemberDialog({ trigger, type = "workspace", onInvite }) {
  const isWorkspace = type === "workspace";
  const entityLabel = isWorkspace ? "workspace" : "bảng";

  const [open, setOpen] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useZodForm(inviteSchema, {
    defaultValues: {
      emails: [],
      role: "member",
      message: "",
    },
  });

  const emails = watch("emails");
  const role = watch("role");

  const addEmail = () => {
    if (!currentEmail.trim()) return;
    
    // Validate email trước khi thêm vào danh sách
    const emailResult = z.string().email().safeParse(currentEmail.trim());
    if (!emailResult.success) {
      setEmailError("Email không đúng định dạng");
      return;
    }

    if (!emails.includes(emailResult.data)) {
      setValue("emails", [...emails, emailResult.data], { shouldValidate: true });
    }
    setCurrentEmail("");
    setEmailError("");
  };

  const removeEmail = (emailToRemove) => {
    setValue("emails", emails.filter((email) => email !== emailToRemove), { shouldValidate: true });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail();
    }
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);
    if (onInvite) {
      onInvite({
        emails: data.emails,
        role: data.role,
        message: data.message,
        onSuccess: () => {
          reset();
          setCurrentEmail("");
          setEmailError("");
          setOpen(false);
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      });
    }
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset();
      setCurrentEmail("");
      setEmailError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            Mời người khác tham gia {entityLabel} và cộng tác trong các dự án.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emails">Email addresses</Label>
            <div className="space-y-2">
              <Input
                id="emails"
                placeholder="Nhập email và nhấn Enter..."
                value={currentEmail}
                onChange={(e) => {
                  setCurrentEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                onKeyDown={handleKeyPress}
                onBlur={addEmail}
              />
              {emailError && (
                <p className="text-xs text-red-500 mt-1">{emailError}</p>
              )}
              {errors.emails && (
                <p className="text-xs text-red-500 mt-1">{errors.emails.message}</p>
              )}
              
              {emails.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {emails.map((email) => (
                    <Badge key={email} variant="secondary" className="flex items-center leading-[1.15] gap-1">
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
            <Select 
              value={role} 
              onValueChange={(val) => setValue("role", val, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
                {...register("message")}
                placeholder="Thêm tin nhắn cá nhân cho lời mời..."
                rows={3}
              />
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">
              Quyền hạn theo vai trò:
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>
                • <strong>Thành viên:</strong> Tạo, chỉnh sửa thẻ và bình luận
              </li>
              <li>
                • <strong>Quản trị:</strong> Toàn quyền quản lý {entityLabel} và
                thành viên
              </li>
            </ul>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={emails.length === 0 || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                `Gửi lời mời (${emails.length})`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default InviteMemberDialog;
