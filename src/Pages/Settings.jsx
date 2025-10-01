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
  Moon,
  Sun,
  Monitor,
} from "lucide-react";

import { DefaultLayout } from "@/Layouts";
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
  const { step } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState(step ?? "");
  const [profile, setProfile] = useState({
    name: "Nguyễn Văn An",
    email: "an@company.com",
    bio: "Product Manager tại ABC Company",
    avatar: "/placeholder.svg?height=80&width=80",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    mentions: true,
    assignments: true,
    comments: false,
    dueDates: true,
    boardUpdates: false,
  });

  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "vi",
    timezone: "Asia/Ho_Chi_Minh",
    dateFormat: "dd/mm/yyyy",
    startWeek: "monday",
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "workspace",
    activityVisibility: "members",
    boardVisibility: "private",
  });

  useEffect(() => {
    navigate(`/settings/${tab}`);
  }, [tab]);

  const navigateTab = (currentTab) => {
    setTab(currentTab);
  };

  return (
    <DefaultLayout>
      {/* Welcome Section */}
      <section className="container max-w-4xl mx-auto">
        <div className="flex items-center mb-6 md:mb-8">
          <section>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Cài đặt
            </h1>
            <p className="text-muted-foreground">
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
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={profile.avatar || "/placeholder.svg"}
                      alt={profile.name}
                    />
                    <AvatarFallback className="text-lg">
                      {profile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button size="sm" className="gap-2 leading-1.5 text-xs">
                      <Camera className="h-4 w-4" />
                      Thay đổi ảnh
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG tối đa 2MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input
                      id="name"
                      value={profile.name}
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

                <Button className="leading-1.5">Lưu thay đổi</Button>
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
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email thông báo</h4>
                      <p className="text-sm text-muted-foreground">
                        Nhận thông báo qua email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          emailNotifications: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Nhận thông báo trên trình duyệt
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          pushNotifications: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Loại thông báo</h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm">Được nhắc đến</span>
                        <p className="text-xs text-muted-foreground">
                          Khi ai đó nhắc đến bạn
                        </p>
                      </div>
                      <Switch
                        checked={notifications.mentions}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            mentions: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm">Được giao thẻ</span>
                        <p className="text-xs text-muted-foreground">
                          Khi được giao thẻ mới
                        </p>
                      </div>
                      <Switch
                        checked={notifications.assignments}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            assignments: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm">Bình luận</span>
                        <p className="text-xs text-muted-foreground">
                          Bình luận mới trên thẻ của bạn
                        </p>
                      </div>
                      <Switch
                        checked={notifications.comments}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            comments: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm">Hạn chót</span>
                        <p className="text-xs text-muted-foreground">
                          Nhắc nhở về thẻ sắp hết hạn
                        </p>
                      </div>
                      <Switch
                        checked={notifications.dueDates}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            dueDates: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm">Cập nhật bảng</span>
                        <p className="text-xs text-muted-foreground">
                          Thay đổi trong bảng bạn theo dõi
                        </p>
                      </div>
                      <Switch
                        checked={notifications.boardUpdates}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            boardUpdates: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button>Lưu cài đặt</Button>
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
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Chủ đề</Label>
                    <Select
                      value={preferences.theme}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, theme: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            Sáng
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            Tối
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            Theo hệ thống
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Ngôn ngữ</Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, language: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vi">Tiếng Việt</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Múi giờ</Label>
                    <Select
                      value={preferences.timezone}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, timezone: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Ho_Chi_Minh">
                          Việt Nam (GMT+7)
                        </SelectItem>
                        <SelectItem value="Asia/Tokyo">
                          Tokyo (GMT+9)
                        </SelectItem>
                        <SelectItem value="America/New_York">
                          New York (GMT-5)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Định dạng ngày</Label>
                    <Select
                      value={preferences.dateFormat}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, dateFormat: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button>Lưu tùy chỉnh</Button>
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
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Hiển thị hồ sơ</Label>
                    <Select
                      value={privacy.profileVisibility}
                      onValueChange={(value) =>
                        setPrivacy({ ...privacy, profileVisibility: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Công khai</SelectItem>
                        <SelectItem value="workspace">Chỉ workspace</SelectItem>
                        <SelectItem value="private">Riêng tư</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Hiển thị hoạt động</Label>
                    <Select
                      value={privacy.activityVisibility}
                      onValueChange={(value) =>
                        setPrivacy({ ...privacy, activityVisibility: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Mọi người</SelectItem>
                        <SelectItem value="members">Chỉ thành viên</SelectItem>
                        <SelectItem value="private">Riêng tư</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Bảng mặc định</Label>
                    <Select
                      value={privacy.boardVisibility}
                      onValueChange={(value) =>
                        setPrivacy({ ...privacy, boardVisibility: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Công khai</SelectItem>
                        <SelectItem value="workspace">Workspace</SelectItem>
                        <SelectItem value="private">Riêng tư</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button>Lưu cài đặt</Button>
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
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Button className="gap-2">
                    <Lock className="h-4 w-4" />
                    Đổi mật khẩu
                  </Button>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Xác thực 2 bước</h4>
                      <p className="text-sm text-muted-foreground">
                        Tăng cường bảo mật tài khoản
                      </p>
                    </div>
                    <Badge variant="outline">Chưa kích hoạt</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Phiên đăng nhập</h4>
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
                    <h4 className="font-medium">Xóa tài khoản</h4>
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
    </DefaultLayout>
  );
}

export default Settings;
