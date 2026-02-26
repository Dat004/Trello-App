import { LogOut, Settings } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/UI";
import { getRoleText } from "@/helpers/role";

function MemberItem({ workspace, member, isOwner = false, isAdmin = false, isMe = false, isOnline = false, readOnly = false, onUpdateRoleMember, onKickMember }) {
    const memberUser = member.user || {};
    const memberId = memberUser._id || member.user;
    const memberName = memberUser.full_name || "Unknown";
    const memberEmail = memberUser.email || "";
    const memberAvatar = memberUser.avatar?.url;
    const memberRole = member.role;

    const canManageMember = (targetMember) => {
        if (readOnly) return false;

        const targetUserId = targetMember.user?._id || targetMember.user;
        const isTargetOwner = targetUserId === (workspace.owner?._id || workspace.owner);

        if (isOwner) return !isMe;
        if (isAdmin) {
            if (isTargetOwner) return false;
            if (isMe) return false;
            if (targetMember.role === "admin") return false;
            return true;
        }

        return false;
    };

    return (
        <div key={member._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                            {memberName.charAt(0)}
                        </AvatarFallback>
                        <AvatarImage
                            src={memberAvatar}
                            alt={memberName}
                        />
                    </Avatar>
                    {isOnline && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background shadow-sm" />
                    )}
                </div>
                <div>
                <p className="text-sm font-medium">
                    {memberName} {isMe && "(Bạn)"}
                </p>
                <p className="text-xs text-muted-foreground">
                    {memberEmail}
                </p>
                </div>
            </div>

            <section className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                {/* Role Badge or Selector */}
                {!canManageMember(member) ? (
                    <Badge variant={memberRole === 'admin' ? 'default' : 'secondary'}>
                        {getRoleText(memberRole, memberId, workspace.owner)}
                    </Badge>
                ) : (
                    <div className="flex items-center">
                        <Select
                            value={memberRole}
                            onValueChange={(value) =>
                                onUpdateRoleMember(value, member)
                            }
                        >
                            <SelectTrigger className="h-8 w-[110px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Quản trị</SelectItem>
                                <SelectItem value="member">Thành viên</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
                </div>

                {canManageMember(member) && (
                <section>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() =>
                                    onKickMember(memberId)
                                }
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 flex items-center cursor-pointer"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Kick thành viên
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </section>
                )}
            </section>
            </div>
    );
}

export default MemberItem;
