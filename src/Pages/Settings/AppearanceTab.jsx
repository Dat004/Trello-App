import { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@/Components/UI";
import { settingsData } from "@/config/data";
import { SETTINGS_TABS } from "@/constants/settings";
import { useUpdateUserSettings } from "@/hooks";
import { useAuthStore, useUIStore } from "@/store";

function AppearanceTab() {
  const { user } = useAuthStore();
  const { isUpdating, updateSettings } = useUpdateUserSettings();

  const [appearance, setAppearance] = useState({
    ...user.settings.appearance,
  });

  // Sync local state when user settings change (e.g., from Sidebar toggle)
  useEffect(() => {
    setAppearance((prev) => ({
      ...prev,
      ...user.settings.appearance,
    }));
  }, [user.settings.appearance]);

  const handleSelect = (setData, key, value) => {
    setData((state) => ({
      ...state,
      [key]: value,
    }));
  };

  return (
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
          disabled={isUpdating}
          onClick={async () => {
            const res = await updateSettings(
              SETTINGS_TABS.APPEARANCE,
              appearance
            );
            if (res?.data?.success && appearance.theme) {
              useUIStore.getState().setTheme(appearance.theme);
            }
          }}
        >
          Lưu cài đặt
        </Button>
      </CardContent>
    </Card>
  );
}

export default AppearanceTab;
