import {
  Bell,
  Camera,
  Lock,
  Palette,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextArea,
} from "@/Components/UI";
import {
  validateFileByIntent,
  getAcceptByIntent,
  UPLOAD_INTENT,
} from "@/lib/file";
import { uploadService } from "@/services/uploadService";
import { UserToast } from "@/context/ToastContext";
import { infoSchema } from "@/schemas/userSchema";
import { settingsData } from "@/config/data";
import { uploadApi } from "@/api/upload";
import { useAuthStore } from "@/store";
import { userApi } from "@/api/user";
import { useZodForm } from "@/hooks";

const tabs = {
  profile: "",
  notifications: "notifications",
  appearance: "appearance",
  privacy: "privacy",
  account: "account",
};

function Settings() {
  const navigate = useNavigate();
  const avatarFileRef = useRef(null);

  const { addToast } = UserToast();
  const { user } = useAuthStore();
  const { step } = useParams();

  const setUser = useAuthStore((state) => state.setUser);

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

  const [tab, setTab] = useState(step ?? "");
  const [pendingAvatar, setPendingAvatar] = useState({
    url: user.avatar.url,
    public_id: user.avatar.public_id,
  });
  const [notifications, setNotifications] = useState({
    ...user.settings.notifications,
  });
  const [appearance, setAppearance] = useState({
    ...user.settings.appearance,
  });
  const [privacy, setPrivacy] = useState({
    ...user.settings.privacy,
  });

  useEffect(() => {
    // Chuyển hướng sang các tab settings tương ứng
    navigate(`/settings/${tab}`);

    // Reset về các cài đặt gốc của người dùng khi thay đổi tab nếu người đó chưa lưu cài đặt
    form.reset({
      full_name: user.full_name,
      bio: user.bio,
    });

    setNotifications({
      ...user.settings.notifications,
    });
    setAppearance({
      ...user.settings.appearance,
    });
    setPrivacy({
      ...user.settings.privacy,
    });
  }, [tab]);

  // Xử lý cập nhât tab state tương ứng
  const navigateTab = (currentTab) => {
    setTab(currentTab);
  };

  // Xử lý cho các switch checked
  const handleChecked = (setData, key, checked) => {
    setData((state) => ({
      ...state,
      [key]: checked,
    }));
  };

  // Xử lý cho các select value
  const handleSelect = (setData, key, value) => {
    setData((state) => ({
      ...state,
      [key]: value,
    }));
  };

  // Xử lý update thông tin, settings của người dùng lên firestore
  const updateSettingUser = async (key, data) => {
    const settingsData = {
      [key]: data,
    };

    const res = await userApi.updateSettings(settingsData);

    addToast({
      type: res.data.success ? "success" : "error",
      title: res.data.message,
      duration: 3000,
    });

    if (res.data.success) {
      setUser(res.data.data.user);

      return;
    }
  };

  const handleUploadNewAvatar = async (e) => {
    const file = e.target.files[0];

    const error = validateFileByIntent(file, UPLOAD_INTENT.AVATAR);
    if (error) {
      addToast({
        type: "error",
        title: error,
      });

      return;
    }

    const result = await uploadService.upload(file, UPLOAD_INTENT.AVATAR);

    addToast({
      type: result.error ? "error" : "success",
      title: result.error
        ? "Upload hình ảnh thất bại"
        : "Upload hình ảnh thành công",
    });

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

  const updateInfoUser = async (data) => {
    const userData = {
      ...data,
      avatar: { ...pendingAvatar },
    };

    const res = await userApi.updateInfo(userData);

    addToast({
      type: res.data.success ? "success" : "error",
      title: res.data.message,
      duration: 3000,
    });

    if (res.data.success) {
      setUser(res.data.data.user);

      return;
    }
  };

  return (
    <section className="container max-w-4xl mx-auto">
      <div className="flex items-center mb-6 md:mb-8">
        <section>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            Cài đặt
          </h1>
          <p className="text-sm sm:text-base md:text-base text-muted-foreground">
            Quản lý tài khoản và tùy chỉnh trải nghiệm của bạn
          </p>
        </section>
      </div>

      <Tabs defaultValue={tab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger
            onClick={() => navigateTab(tabs.profile)}
            value={tabs.profile}
            className="gap-2"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Hồ sơ</span>
          </TabsTrigger>
          <TabsTrigger
            onClick={() => navigateTab(tabs.notifications)}
            value={tabs.notifications}
            className="gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Thông báo</span>
          </TabsTrigger>
          <TabsTrigger
            onClick={() => navigateTab(tabs.appearance)}
            value={tabs.appearance}
            className="gap-2"
          >
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Giao diện</span>
          </TabsTrigger>
          <TabsTrigger
            onClick={() => navigateTab(tabs.privacy)}
            value={tabs.privacy}
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Riêng tư</span>
          </TabsTrigger>
          <TabsTrigger
            onClick={() => navigateTab(tabs.account)}
            value={tabs.account}
            className="gap-2"
          >
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Tài khoản</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value={tabs.profile} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>
                Cập nhật thông tin hồ sơ của bạn
              </CardDescription>
            </CardHeader>
            <section className="px-4 sm:px-6">
              <Separator />
            </section>
            <CardContent>
              <form
                className="space-y-6"
                onSubmit={handleSubmit(updateInfoUser)}
              >
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

                <Button type="submit" className="leading-1.5 h-9">
                  Lưu thay đổi
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value={tabs.notifications} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>
                Chọn loại thông báo bạn muốn nhận
              </CardDescription>
            </CardHeader>
            <section className="px-4 sm:px-6">
              <Separator />
            </section>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm md:text-base font-medium">
                      Email thông báo
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo qua email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      handleChecked(setNotifications, "email", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm md:text-base font-medium">
                      Push notifications
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo trên trình duyệt
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) =>
                      handleChecked(setNotifications, "push", checked)
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm md:text-base font-medium">
                  Loại thông báo
                </h4>

                <div className="space-y-3">
                  {settingsData.notifications.map((not) => (
                    <div
                      key={not.key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <span className="text-sm">{not.label}</span>
                        <p className="text-xs text-muted-foreground">
                          {not.title}
                        </p>
                      </div>
                      <Switch
                        checked={notifications[not.key]}
                        onCheckedChange={(checked) =>
                          handleChecked(setNotifications, not.key, checked)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="h-9"
                onClick={() =>
                  updateSettingUser(tabs.notifications, notifications)
                }
              >
                Lưu cài đặt
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value={tabs.appearance} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tùy chỉnh giao diện</CardTitle>
              <CardDescription>Cá nhân hóa trải nghiệm sử dụng</CardDescription>
            </CardHeader>
            <section className="px-4 sm:px-6">
              <Separator />
            </section>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {settingsData.appearance.map((app) => (
                  <div key={app.key} className="space-y-2">
                    <Label>{app.label}</Label>
                    <Select
                      value={appearance[app.key]}
                      onValueChange={(value) =>
                        handleSelect(setAppearance, app.key, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {app.items.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            <div className="flex items-center gap-2">
                              {item.icon && <item.icon className="h-4 w-4" />}
                              {item.text_value}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <Button
                className="h-9"
                onClick={() => updateSettingUser(tabs.appearance, appearance)}
              >
                Lưu cài đặt
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value={tabs.privacy} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt riêng tư</CardTitle>
              <CardDescription>
                Kiểm soát ai có thể xem thông tin của bạn
              </CardDescription>
            </CardHeader>
            <section className="px-4 sm:px-6">
              <Separator />
            </section>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {settingsData.privacy.map((pr) => (
                  <div key={pr.key} className="space-y-2">
                    <Label>{pr.label}</Label>
                    <Select
                      value={privacy[pr.key]}
                      onValueChange={(value) =>
                        handleSelect(setPrivacy, pr.key, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pr.items.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            <div className="flex items-center gap-2">
                              {item.icon && <item.icon className="h-4 w-4" />}
                              {item.text_value}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <Button
                className="h-9"
                onClick={() => updateSettingUser(tabs.privacy, privacy)}
              >
                Lưu cài đặt
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value={tabs.account} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật tài khoản</CardTitle>
              <CardDescription>Quản lý mật khẩu và bảo mật</CardDescription>
            </CardHeader>
            <section className="px-4 sm:px-6">
              <Separator />
            </section>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button className="gap-2 h-9">
                  <Lock className="h-4 w-4" />
                  Đổi mật khẩu
                </Button>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="text-sm md:text-base font-medium">
                      Xác thực 2 bước
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Tăng cường bảo mật tài khoản
                    </p>
                  </div>
                  <Badge variant="outline">Chưa kích hoạt</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="text-sm md:text-base font-medium">
                      Phiên đăng nhập
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Quản lý các thiết bị đã đăng nhập
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Vùng nguy hiểm</CardTitle>
              <CardDescription>
                Các hành động không thể hoàn tác
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                <div>
                  <h4 className="text-sm md:text-base font-medium">
                    Xóa tài khoản
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Xóa vĩnh viễn tài khoản và tất cả dữ liệu
                  </p>
                </div>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Xóa tài khoản
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default Settings;
