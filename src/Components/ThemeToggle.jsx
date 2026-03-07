import { Monitor, Moon, Sun } from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/UI";
import { useUpdateUserSettings } from "@/hooks";
import useUIStore from "@/store/uiStore";

function ThemeToggle({ collapsed = false }) {
  const { theme, setTheme } = useUIStore();
  const { updateSettings } = useUpdateUserSettings();

  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    // Update new theme to BE
    await updateSettings("appearance", { theme: newTheme });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`w-full justify-start ${collapsed ? "justify-center px-2" : "px-3"}`}
          title="Giao diện"
        >
          {theme === "light" && <Sun className="h-4 w-4 shrink-0" />}
          {theme === "dark" && <Moon className="h-4 w-4 shrink-0" />}
          {theme === "system" && <Monitor className="h-4 w-4 shrink-0" />}
          {!collapsed && <span className="ml-3 truncate">Giao diện</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={collapsed ? "center" : "end"} className="w-36">
        <DropdownMenuItem onClick={() => handleThemeChange("light")} className="gap-2">
          <Sun className="h-4 w-4" /> Sáng
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")} className="gap-2">
          <Moon className="h-4 w-4" /> Tối
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")} className="gap-2">
          <Monitor className="h-4 w-4" /> Hệ thống
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeToggle;
