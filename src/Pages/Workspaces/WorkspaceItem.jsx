import {
  Users,
  Trello,
  Settings,
  Star,
  MoreHorizontal,
  Activity,
  Trash2,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";

import BoardsInWorkspaceDialog from "@/Components/BoardsInWorkspaceDialog";
import SettingWorkspaceDialog from "@/Components/SettingWorkspaceDialog";
import { getMyRole, getRoleText, getRoleVariant } from "@/helpers/role";
import { useAuthStore, useWorkspaceStore } from "@/store";
import { useApiMutation, useFavorites } from "@/hooks";
import MembersDialog from "@/Components/MembersDialog";
import { formatDateOnly } from "@/helpers/formatTime";
import { workspaceApi } from "@/api/workspace";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  Button,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/UI";

function WorkspaceItem({ workspace, onDelete }) {
  const { user } = useAuthStore();
  const { toggleWorkspaceStar, isTogglingWorkspace } = useFavorites({
    workspaceId: workspace._id
  });
  const members = useWorkspaceStore(
    (state) => state.membersMap[workspace._id],
    (a, b) => a === b
  ) || [];
  const pendingMembers = useWorkspaceStore(
    (state) => state.joinRequestsMap[workspace._id] || [],
    (a, b) => a === b
  );
  const addMemberToStore = useWorkspaceStore((state) => state.addMemberToStore);
  const removeJoinRequestFromStore = useWorkspaceStore((state) => state.removeJoinRequestFromStore);
  
  const isOwner = user._id === workspace.owner;
  const role = getMyRole(members);
  const roleVariant = getRoleVariant(role);

  const { mutate: handleJoinRequest } = useApiMutation(
    (requestId, data) => workspaceApi.handleJoinRequest(workspace._id, requestId, data),
  );

  const handleAcceptRequest = async (requestId) => {
    const res = await handleJoinRequest(requestId, {
      status: "accepted"
    })

    if (res.success) {
      removeJoinRequestFromStore(workspace._id, requestId);
      addMemberToStore(workspace._id, res.data.data.member);
    }
  }

  const handleRejectRequest = async (requestId) => {
    const res = await handleJoinRequest(requestId, {
      status: "declined"
    })

    if (res.success) {
      removeJoinRequestFromStore(workspace._id, requestId);
    }
  }

  return (
    <Card
      key={workspace._id}
      className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
    >
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback
                className={`${workspace.color} text-white font-semibold`}
              >
                {workspace.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-base">
                <Link to={`/workspaces/${workspace._id}`}>
                  {workspace.name}
                </Link>
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={isOwner ? "destructive" : roleVariant}
                  className="text-xs"
                >
                  {isOwner ? "Chủ sở hữu" : getRoleText(role)}
                </Badge>
              </div>
            </div>
          </div>

          <section className="flex items-center gap-2">
            {workspace.is_starred && (
              <span className="cursor-pointer" onClick={() => toggleWorkspaceStar(workspace)}>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <SettingWorkspaceDialog
                  workspace={workspace}
                  onUpdateWorkspace={(data) =>
                    handleUpdateWorkspace(workspace._id, data)
                  }
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Settings className="h-4 w-4 mr-2" />
                      Cài đặt
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuItem onClick={() => toggleWorkspaceStar(workspace)}>
                  {isTogglingWorkspace ? (
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  ) : (
                    <Star className={cn("h-4 w-4 mr-2", workspace.is_starred && "fill-yellow-400 text-yellow-400")} />
                  )}
                  {workspace.is_starred ? "Bỏ yêu thích" : "Yêu thích"}
                </DropdownMenuItem>
                {workspace.owner === user._id && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(workspace._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa workspace
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </section>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <CardDescription className="mb-4 line-clamp-2">
          {workspace.description}
        </CardDescription>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Trello className="h-4 w-4 text-muted-foreground" />
                <span>
                  {workspace.board_count === 0
                    ? "Chưa có bảng"
                    : `${workspace.board_count} bảng`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{members.length} thành viên</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Activity className="h-3 w-3" />
            <span>Hoạt động: {formatDateOnly(workspace.created_at)}</span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <BoardsInWorkspaceDialog 
              workspace={workspace}
              trigger={
                <Button
                  size="sm"
                  className="flex-1 h-8 sm:h-9 font-normal sm:font-medium"
                >
                  Xem bảng
                </Button>
              } />
          
            <MembersDialog
              type="workspace"
              entity={workspace}
              members={members}
              pendingMembers={pendingMembers}
              onAcceptRequest={handleAcceptRequest}
              onRejectRequest={handleRejectRequest}
              trigger={
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4" />
                </Button>
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WorkspaceItem;
