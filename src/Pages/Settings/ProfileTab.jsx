import { useEffect, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";

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
  const previewUrlRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingAvatar, setPendingAvatar] = useState({
    url: user.avatar?.url || "",
    public_id: user.avatar?.public_id || "",
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
    (responseData) => {
      setUser(responseData.user);
      setPendingFile(null);
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
      setPendingAvatar({
        url: responseData.user.avatar?.url || "",
        public_id: responseData.user.avatar?.public_id || "",
      });
    }
  );

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const clearLocalPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  const handleSelectAvatar = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const error = validateFileByIntent(file, UPLOAD_INTENT.AVATAR);
    if (error) {
      addToast({
        type: "error",
        title: error,
      });
      return;
    }

    clearLocalPreview();
    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;
    setPendingFile(file);
    setPendingAvatar({
      url: previewUrl,
      public_id: pendingAvatar.public_id,
    });
  };

  const updateInfoUser = async (data) => {
    if (isUpdating || isUploading) return;

    let avatarPayload = {
      url: user.avatar?.url || "",
      public_id: user.avatar?.public_id || "",
    };

    if (pendingFile) {
      setIsUploading(true);
      const toastId = addToast({
        type: "loading",
        title: "Đang tải ảnh lên...",
      });

      try {
        const result = await uploadService.upload(pendingFile, UPLOAD_INTENT.AVATAR);
        if (result?.error || !result?.public_id) {
          addToast({
            type: "error",
            title: "Upload hình ảnh thất bại",
          });
          return;
        }

        avatarPayload = {
          url: result.eager?.[0]?.secure_url || result.secure_url,
          public_id: result.public_id,
        };
        addToast({
          type: "success",
          title: "Upload hình ảnh thành công",
        });
      } catch {
        addToast({
          type: "error",
          title: "Upload hình ảnh thất bại",
        });
        return;
      } finally {
        removeToast(toastId);
        setIsUploading(false);
      }
    } else if (pendingAvatar.public_id) {
      avatarPayload = {
        url: pendingAvatar.url?.startsWith("blob:")
          ? user.avatar?.url || ""
          : pendingAvatar.url,
        public_id: pendingAvatar.public_id,
      };
    }

    updateInfo({
      ...data,
      avatar: avatarPayload,
    });
  };

  const isBusy = isUpdating || isUploading;

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
                disabled={isBusy}
                className="gap-2 leading-1.5 text-xs h-8"
              >
                <Camera className="h-4 w-4" />
                Thay đổi ảnh
              </Button>
              <p className="text-xs sm:text-sm text-muted-foreground">
                JPG, PNG tối đa 2MB. Ảnh chỉ được tải lên khi bạn lưu thay đổi.
              </p>
              <section>
                <Input
                  type="file"
                  ref={avatarFileRef}
                  onChange={handleSelectAvatar}
                  disabled={isBusy}
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
              <Input id="full_name" disabled={isBusy} {...register("full_name")} />
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
              disabled={isBusy}
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
            disabled={isBusy}
          >
            {isBusy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploading ? "Đang tải ảnh..." : "Đang lưu..."}
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ProfileTab;
