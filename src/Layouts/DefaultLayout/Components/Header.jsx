import { Search, Plus, User, LogOut, Settings } from "lucide-react";

import NotificationsPanel from "@/Components/NotificationsPanel";
import CreateBoardDialog from "@/Components/CreateBoardDialog";
import {
  Button,
  Input,
  Avatar,
  AvatarImage,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/Components/UI";

function Header() {
  return (
    <header className="sticky top-0 z-100 flex items-center border-b h-16 w-full bg-background/95 backdrop-blur">
      <section className="container mx-auto flex items-center px-4">
        {/* Logo và Navigation */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                T
              </span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Trello Clone</h1>
          </div>

          <nav className="hidden md:flex items-center gap-4">
            <Button className="leading-[1.35]" variant="ghost" size="sm">
              Bảng làm việc
            </Button>
            <Button className="leading-[1.35]" variant="ghost" size="sm">
              Mẫu
            </Button>
          </nav>
        </div>

        {/* Search và Actions */}
        <div className="ml-auto flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Tìm kiếm bảng, thẻ..." className="w-64 pl-10" />
          </div>

          {/* Create Button */}
          <CreateBoardDialog
            trigger={
              <Button size="sm" className="leading-1.5 gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Tạo mới</span>
              </Button>
            }
          />

          {/* Notifications */}
          <NotificationsPanel />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                {/* Avatar */}
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Hồ sơ</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài đặt</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
    </header>
  );
}

export default Header;
