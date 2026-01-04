import {
  Bell,
  Lock,
  Palette,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/UI";
import { SETTINGS_TABS } from "@/constants/settings";
import NotificationsTab from "./NotificationsTab";
import AppearanceTab from "./AppearanceTab";
import PrivacyTab from "./PrivacyTab";
import AccountTab from "./AccountTab";
import ProfileTab from "./ProfileTab";

function Settings() {
  const { step } = useParams();
  const navigate = useNavigate();
  
  const [tab, setTab] = useState(step ?? "");

  useEffect(() => {
    // Chuyển hướng sang các tab settings tương ứng
    navigate(`/settings/${tab}`);
  }, [tab]);

  // Xử lý cập nhât tab state tương ứng
  const navigateTab = (currentTab) => {
    setTab(currentTab);
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
            onClick={() => navigateTab(SETTINGS_TABS.PROFILE)}
            value={SETTINGS_TABS.PROFILE}
            className="gap-2"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Hồ sơ</span>
          </TabsTrigger>
          <TabsTrigger
            onClick={() => navigateTab(SETTINGS_TABS.NOTIFICATIONS)}
            value={SETTINGS_TABS.NOTIFICATIONS}
            className="gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Thông báo</span>
          </TabsTrigger>
          <TabsTrigger
            onClick={() => navigateTab(SETTINGS_TABS.APPEARANCE)}
            value={SETTINGS_TABS.APPEARANCE}
            className="gap-2"
          >
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Giao diện</span>
          </TabsTrigger>
          <TabsTrigger
            onClick={() => navigateTab(SETTINGS_TABS.PRIVACY)}
            value={SETTINGS_TABS.PRIVACY}
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Riêng tư</span>
          </TabsTrigger>
          <TabsTrigger
            onClick={() => navigateTab(SETTINGS_TABS.ACCOUNT)}
            value={SETTINGS_TABS.ACCOUNT}
            className="gap-2"
          >
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Tài khoản</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value={SETTINGS_TABS.PROFILE} className="space-y-6">
          <ProfileTab />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value={SETTINGS_TABS.NOTIFICATIONS} className="space-y-6">
          <NotificationsTab />
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value={SETTINGS_TABS.APPEARANCE} className="space-y-6">
          <AppearanceTab />
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value={SETTINGS_TABS.PRIVACY} className="space-y-6">
          <PrivacyTab />
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value={SETTINGS_TABS.ACCOUNT} className="space-y-6">
          <AccountTab />
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default Settings;
