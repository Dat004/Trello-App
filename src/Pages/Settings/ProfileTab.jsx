import { useState, useRef } from "react";
import { Camera } from "lucide-react";

import { uploadService } from "@/services/uploadService";
import { useApiMutation, useZodForm } from "@/hooks";
import { UserToast } from "@/context/ToastContext";
import { infoSchema } from "@/schemas/userSchema";
import { useAuthStore } from "@/store";
import { userApi } from "@/api/user";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  TextArea,
} from "@/Components/UI";
import {
  getAcceptByIntent,
  UPLOAD_INTENT,
  validateFileByIntent,
} from "@/lib/file";

function ProfileTab() {
  const { addToast, removeToast } = UserToast();
  const { user } = useAuthStore();

  const avatarFileRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState({
    url: user.avatar.url,
    public_id: user.avatar.public_id,
  });

  const form = useZodForm(infoSchema, {
    defaultValues: {
      full_name: user.full_name,
      bio: user.bio,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const setUser = useAuthStore((state) => state.setUser);

  const { mutate: updateInfo, isLoading: isUpdating } = useApiMutation(
    (data) => userApi.updateInfo(data),
    (responseData) => setUser(responseData.user)
  );

  const updateInfoUser = (data) => {
    const userData = {
      ...data,
      avatar: { ...pendingAvatar },
    };
    
    updateInfo(userData);
  };

  const handleUploadNewAvatar = async (e) => {
    if (isUploading) return; // Tránh spam upload file khi đang xử lý upload file trước đó
    setIsUploading(true);

    const file = e.target.files[0];
    const error = validateFileByIntent(file, UPLOAD_INTENT.AVATAR);
    if (error) {
      addToast({
        type: "error",
        title: error,
      });

      // Set false để tránh bị treo UI khi không chọn file
      setIsUploading(false);

      return;
    }

    const toastId = addToast({
      type: "loading",
      title: "Đang tải ảnh lên...",
    });
    const result = await uploadService.upload(file, UPLOAD_INTENT.AVATAR);

    addToast({
      type: result.error ? "error" : "success",
      title: result.error
        ? "Upload hình ảnh thất bại"
        : "Upload hình ảnh thành công",
    });
    removeToast(toastId);
    setIsUploading(false);
    if (result.error) {
      return;
    }

    const { public_id, eager } = result;
    if (public_id && eager) {
      setPendingAvatar({
        url: eager[0]?.secure_url,
        public_id,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
        <CardDescription>Cập nhật thông tin hồ sơ của bạn</CardDescription>
      </CardHeader>
      <section className="px-4 sm:px-6">
        <Separator />
      </section>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(updateInfoUser)}>
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={pendingAvatar.url} alt={user.full_name} />
              <AvatarFallback className="text-lg">
                {user.full_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button
                size="sm"
                type="button"
                onClick={() => avatarFileRef.current.click()}
                className="gap-2 leading-1.5 text-xs h-8"
              >
                <Camera className="h-4 w-4" />
                Thay đổi ảnh
              </Button>
              <p className="text-xs sm:text-sm text-muted-foreground">
                JPG, PNG tối đa 2MB
              </p>
              <section>
                <Input
                  type="file"
                  ref={avatarFileRef}
                  onChange={handleUploadNewAvatar}
                  disabled={isUpdating || isUploading}
                  accept={getAcceptByIntent(UPLOAD_INTENT.AVATAR)}
                  className="hidden opacity-0 invisible select-none pointer-events-none"
                />
              </section>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <section className="flex items-center">
                <Label className="leading-4" htmlFor="full_name">
                  Họ và tên
                </Label>

                {errors.full_name?.message && (
                  <span className="text-xs ml-auto text-destructive">
                    {errors.full_name.message}
                  </span>
                )}
              </section>
              <Input id="full_name" {...register("full_name")} />
            </div>
            <div className="space-y-2">
              <section className="flex items-center">
                <Label className="leading-4" htmlFor="email">
                  Email
                </Label>
              </section>
              <Input
                readOnly
                disabled
                id="email"
                type="email"
                value={user.email}
              />
            </div>
          </div>

          <div className="space-y-2">
            <section className="flex items-center">
              <Label className="leading-4" htmlFor="bio">
                Giới thiệu
              </Label>
            </section>
            <TextArea
              id="bio"
              {...register("bio")}
              placeholder="Viết vài dòng về bản thân..."
              rows={3}
            />
            {errors.bio?.message && (
              <span className="text-xs text-destructive">
                {errors.bio.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            className="leading-1.5 h-9"
            disabled={isUpdating || isUploading}
          >
            Lưu thay đổi
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ProfileTab;
