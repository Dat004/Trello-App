import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Bell,
  Shield,
  Palette,
  Trash2,
  Camera,
  Lock,
} from "lucide-react";

import { settingsData } from "../../config/data";
import { UserAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  TextArea,
  Switch,
  Badge,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/UI";

const tabs = {
  profile: "",
  notifications: "notifications",
  preferences: "preferences",
  privacy: "privacy",
  account: "account",
};

function Settings() {
  const { user } = UserAuth();
  const { step } = useParams();
  const { settings: userSettings } = user;

  const navigate = useNavigate();
  const [tab, setTab] = useState(step ?? "");
  const [profile, setProfile] = useState({
    displayName: user.displayName,
    email: user.email,
    bio: user.bio,
    photoURL: user.photoURL,
  });
  const [notifications, setNotifications] = useState({
    ...userSettings.notifications,
  });
  const [appearance, setAppearance] = useState({
    ...userSettings.appearance,
  });
  const [privacy, setPrivacy] = useState({
    ...userSettings.privacy,
  });

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  useEffect(() => {
    console.log(appearance);
  }, [appearance]);

  useEffect(() => {
    console.log(privacy);
  }, [privacy]);

  useEffect(() => {
    navigate(`/settings/${tab}`);
  }, [tab]);

  const navigateTab = (currentTab) => {
    setTab(currentTab);
  };

  const handleChecked = (setData, key, checked) => {
    setData((state) => ({
      ...state,
      [key]: checked,
    }));
  };

  const handleSelect = (setData, key, value) => {
    setData((state) => ({
      ...state,
      [key]: value,
    }));
  };

  return (
    <>
      {/* Welcome Section */}
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
              onClick={() => navigateTab(tabs.preferences)}
              value={tabs.preferences}
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
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={profile.photoURL}
                      alt={profile.displayName}
                    />
                    <AvatarFallback className="text-lg">
                      {profile.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button size="sm" className="gap-2 leading-1.5 text-xs h-8">
                      <Camera className="h-4 w-4" />
                      Thay đổi ảnh
                    </Button>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      JPG, PNG tối đa 2MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input
                      id="name"
                      value={profile.displayName}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Giới thiệu</Label>
                  <TextArea
                    id="bio"
                    placeholder="Viết vài dòng về bản thân..."
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <Button className="leading-1.5 h-9">Lưu thay đổi</Button>
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

                <Button className="h-9">Lưu cài đặt</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value={tabs.preferences} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tùy chỉnh giao diện</CardTitle>
                <CardDescription>
                  Cá nhân hóa trải nghiệm sử dụng
                </CardDescription>
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
                                {item.text_value}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                <Button className="h-9">Lưu tùy chỉnh</Button>
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
                              {item.text_value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                <Button className="h-9">Lưu cài đặt</Button>
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
                <CardTitle className="text-destructive">
                  Vùng nguy hiểm
                </CardTitle>
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
    </>
  );
}

export default Settings;
