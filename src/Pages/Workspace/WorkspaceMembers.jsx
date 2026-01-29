import { useEffect } from "react";
import { Plus, Settings, LogOut, Users } from "lucide-react"

import { useAuthStore, useWorkspaceStore } from "@/store";
import { workspaceApi } from "@/api/workspace";
import { getRoleText } from "@/helpers/role";
import { useApiMutation } from "@/hooks";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
  Badge,
} from "@/Components/UI";

function WorkspaceMembers({ workspace }) {
  const members = useWorkspaceStore((state) => state.membersMap[workspace._id] || []);
  const updateMemberInStore = useWorkspaceStore((state) => state.updateMemberInStore);
  const removeMemberFromStore = useWorkspaceStore((state) => state.removeMemberFromStore);
  const setMembers = useWorkspaceStore((state) => state.setMembers);
  const user = useAuthStore(s => s.user);

  const isMyWorkspace = workspace.owner === user._id;
  const isAdminWorkspace = members.find(m => m.user._id === user._id)?.role === "admin";

  const { mutate: updateRole } = useApiMutation(
    (data) => workspaceApi.updateMemberRole(workspace._id, data),
  );
  const { mutate: kickMember } = useApiMutation(
    (data) => workspaceApi.kickMember(workspace._id, data),
  );

  useEffect(() => {
    if (!workspace) return;

    setMembers(workspace._id, workspace.members);
  }, [workspace]);

  const handleUpdateRoleMember = async (role, member) => {
    if (!canMangementMember(member)) return;
    if (workspace.owner === member.user._id) return;

    const res = await updateRole({
      member_id: member.user._id,
      role,
    });

    if (res.success) {
      updateMemberInStore(workspace._id, member._id, { role });
    }
  };

  const handleKickMember = async (member_id) => {
    if (!member_id) return;

    const res = await kickMember({
      member_id,
    });

    if (res.success) {
      const targetMember = members.find(m => m.user._id === member_id);
      if (targetMember) {
        removeMemberFromStore(workspace._id, targetMember._id);
      }
    }
  };

  const canMangementMember = (member) => {
    const isTargetOwner = member.user._id === workspace.owner;
    const isTargetAdmin = member.role === "admin";
    const isMe = member.user._id === user._id;
    
    if (isMyWorkspace) return !isTargetOwner;
    if (isAdminWorkspace) return !isTargetOwner && !isTargetAdmin && !isMe;

    return false;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Thành viên ({members.length})</h3>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm thành viên
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-border bg-muted/30">
          <UsersIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground font-medium mb-1">Chưa có thành viên nào</p>
          <p className="text-sm text-muted-foreground mb-4">Thêm thành viên vào workspace để bắt đầu cộng tác</p>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm thành viên
          </Button>
        </div>
      ) : (
        <div className="space-y-2 border border-border rounded-lg p-4">
          {members.map((member) => {
            const isOwner = member.user._id === workspace.owner;
            const isMe = member.user._id === user._id;

            return (
              <div key={member._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {member.user.full_name.charAt(0)}
                    </AvatarFallback>
                    <AvatarImage
                      src={member.user.avatar.url}
                      alt={member.user.full_name}
                    ></AvatarImage>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {member.user.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>
                </div>

                <section className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {isOwner || isMe ? (
                      <Badge>{getRoleText(member.role, member.user._id, workspace.owner)}</Badge>
                    ) : (
                      <Select
                        value={member.role}
                        disabled={!canMangementMember(member)}
                        onValueChange={(value) =>
                          handleUpdateRoleMember(value, member)
                        }
                      >
                        <SelectTrigger id="role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            Quản trị
                          </SelectItem>
                          <SelectItem value="member">
                            Thành viên
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {canMangementMember(member) && (
                    <section>
                      <DropdownMenu>
                        <DropdownMenuTrigger align="start">
                          <Button variant="ghost" className="w-8 h-8">
                            <Settings />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              handleKickMember(member.user._id)
                            }
                            className="hover:bg-destructive hover:text-background justify-center"
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
            )
          })}
        </div>
      )}
    </div>
  )
}

export default WorkspaceMembers;
