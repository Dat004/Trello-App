import { useState } from "react";

import { SETTINGS_TABS } from "@/constants/settings";
import { useUpdateUserSettings } from "@/hooks";
import { settingsData } from "@/config/data";
import { useAuthStore } from "@/store";
import {
  Button,
  Switch,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Card,
  Separator,
} from "@/Components/UI";

function NotificationsTab() {
  const { user } = useAuthStore();
  const { isUpdating, updateSettings } = useUpdateUserSettings();

  const [notifications, setNotifications] = useState({
    ...user.settings.notifications,
  });

  const handleChecked = (setData, key, checked) => {
    setData((state) => ({
      ...state,
      [key]: checked,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cài đặt thông báo</CardTitle>
        <CardDescription>Chọn loại thông báo bạn muốn nhận</CardDescription>
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
          <h4 className="text-sm md:text-base font-medium">Loại thông báo</h4>

          <div className="space-y-3">
            {settingsData.notifications.map((not) => (
              <div key={not.key} className="flex items-center justify-between">
                <div>
                  <span className="text-sm">{not.label}</span>
                  <p className="text-xs text-muted-foreground">{not.title}</p>
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
          disabled={isUpdating}
          onClick={() => updateSettings(SETTINGS_TABS.NOTIFICATIONS, notifications)}
        >
          Lưu cài đặt
        </Button>
      </CardContent>
    </Card>
  );
}

export default NotificationsTab;
