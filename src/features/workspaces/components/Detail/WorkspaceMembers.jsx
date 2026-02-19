import { Plus, Users as UsersIcon } from "lucide-react";

import { useKickMember, useUpdateMemberRole } from "@/features/workspaces/api/useWorkspaceMembers";
import MemberItem from "@/Components/MemberItem";
import { Button } from "@/Components/UI";
import { useAuthStore } from "@/store";

function WorkspaceMembers({ workspace, readOnly }) {
  const members = workspace.members || [];
  const user = useAuthStore(s => s.user);

  const isMyWorkspace = (workspace.owner?._id || workspace.owner) === user._id;
  const myMemberInfo = members.find(m => (m.user?._id || m.user) === user._id);
  const isAdmin = myMemberInfo?.role === "admin";
  
  const { mutate: updateRole } = useUpdateMemberRole();
  const { mutate: kickMember } = useKickMember();

  const handleUpdateRoleMember = (role, member) => {
    const memberId = member.user?._id || member.user;
    updateRole({
      workspaceId: workspace._id,
      member_id: memberId,
      role,
    });
  };

  const handleKickMember = (targetUserId) => {
    kickMember({
      workspaceId: workspace._id,
      member_id: targetUserId,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Thành viên ({members.length})</h3>
        {!readOnly && (
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm thành viên
          </Button>
        )}
      </div>

      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-border bg-muted/30">
          <UsersIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground font-medium mb-1">Chưa có thành viên nào</p>
          <p className="text-sm text-muted-foreground mb-4">Thêm thành viên vào workspace để bắt đầu cộng tác</p>
          {!readOnly && (
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm thành viên
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2 border border-border rounded-lg p-4">
          {members.map((member) => 
            <MemberItem
              key={member._id}
              member={member}
              workspace={workspace}
              isMe={member.user?._id === user._id}
              isAdmin={isAdmin}
              isOwner={isMyWorkspace}
              readOnly={readOnly}
              onKickMember={handleKickMember}
              onUpdateRoleMember={handleUpdateRoleMember}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default WorkspaceMembers;
