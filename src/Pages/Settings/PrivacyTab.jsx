import { useState } from "react";

import { SETTINGS_TABS } from "@/constants/settings";
import { useUpdateUserSettings } from "@/hooks";
import { settingsData } from "@/config/data";
import { useAuthStore } from "@/store";
import {
  Button,
  Separator,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Card,
  Label,
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/Components/UI";

function PrivacyTab() {
  const { user } = useAuthStore();
  const { isUpdating, updateSettings } = useUpdateUserSettings();

  const [privacy, setPrivacy] = useState({
    ...user.settings.privacy,
  });

  const handleSelect = (setData, key, value) => {
    setData((state) => ({
      ...state,
      [key]: value,
    }));
  };

  return (
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
          disabled={isUpdating}
          onClick={() => updateSettings(SETTINGS_TABS.PRIVACY, privacy)}
        >
          Lưu cài đặt
        </Button>
      </CardContent>
    </Card>
  );
}

export default PrivacyTab;
