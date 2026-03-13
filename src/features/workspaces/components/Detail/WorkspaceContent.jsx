import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Star, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import { workspaceApi } from "@/api/workspace";
import MembersDialog from "@/Components/MembersDialog";
import {
  Button,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/Components/UI';
import { WORKSPACE_KEYS } from "@/features/workspaces/api/useWorkspaceDetail";
import { useWorkspaceContext } from "@/features/workspaces/components/WorkspaceAccessGuard";
import { useWorkspaceSocket } from "@/features/workspaces/hooks/useWorkspaceSocket";
import { useApiMutation, useFavorites } from "@/hooks";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/store";
import { useWorkspaceActivities } from "../../api/useWorkspaceActivities";
import WorkspaceActivity from "./WorkspaceActivities";
import WorkspaceBoards from "./WorkspaceBoards";
import WorkspaceMembers from "./WorkspaceMembers";
import WorkspaceSettings from "./WorkspaceSettings";

export default function WorkspaceContent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { workspace, isMember, readOnly } = useWorkspaceContext();
  
  // Setup Realtime Scoped
  useWorkspaceSocket(workspace._id);
  useWorkspaceActivities(workspace._id); 

  const [activeTab, setActiveTab] = useState("boards");
  
  // Favorites
  const favoriteWorkspaces = useFavoritesStore((state) => state.favoriteWorkspaces);
  const { toggleWorkspaceStar, isTogglingWorkspace } = useFavorites();

  // Members & Join Requests
  const workspaceMembers = workspace.members || [];
  const pendingMembers = workspace.join_requests || [];

  // Mutation: Handle Join Request
  const { mutate: handleJoinRequest } = useApiMutation(
    (requestId, data) => workspaceApi.handleJoinRequest(workspace._id, requestId, data)
  );

  const handleAcceptRequest = async (requestId) => {
    if (readOnly) return;

    const res = await handleJoinRequest(requestId, { status: "accepted" });
    if (res?.success) {
      queryClient.invalidateQueries(WORKSPACE_KEYS.detail(workspace._id));
    }
  }

  const handleRejectRequest = async (requestId) => {
    if (readOnly) return;

    const res = await handleJoinRequest(requestId, { status: "declined" });
    if (res?.success) {
      queryClient.invalidateQueries(WORKSPACE_KEYS.detail(workspace._id));
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="py-4 md:py-6">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back button + Workspace info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/workspaces')} // Back to list
                className="text-muted-foreground hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-3 min-w-0">
                <div className={`h-10 w-10 rounded-lg ${workspace.color || 'bg-blue-500'} flex items-center justify-center flex-shrink-0`}>
                  {/* Có thể thêm icon hoặc chữ cái đầu */}
                  <span className="text-white font-bold text-lg">
                    {workspace.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <h1 className="font-semibold text-foreground truncate">{workspace.name}</h1>
                  <p className="text-xs text-muted-foreground truncate">{workspace.description}</p>
                </div>
              </div>
            </div>

            {/* Right: Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {!readOnly && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={isTogglingWorkspace}
                    onClick={() => toggleWorkspaceStar(workspace)}
                    className="text-muted-foreground hover:bg-muted gap-1 hidden sm:flex"
                    title="Yêu thích"
                  >
                    {isTogglingWorkspace ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Star className={cn("h-4 w-4", favoriteWorkspaces.some((fw) => fw._id === workspace._id) ? "fill-yellow-400 text-yellow-400" : "")} />
                    )}
                    <span className="hidden md:inline text-xs">
                      {favoriteWorkspaces.some((fw) => fw._id === workspace._id) ? "Bỏ yêu thích" : "Yêu thích"}
                    </span>
                  </Button>

                  {/* <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:bg-muted gap-1 hidden sm:flex"
                    title="Chia sẻ"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="hidden md:inline text-xs">Chia sẻ</span>
                  </Button> */}

                  <MembersDialog
                    type="workspace"
                    entity={workspace}
                    members={workspaceMembers}
                    pendingMembers={pendingMembers}
                    onAcceptRequest={handleAcceptRequest}
                    onRejectRequest={handleRejectRequest}
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:bg-muted gap-1 cursor-pointer relative"
                        title="Thành viên"
                      >
                        <Users className="h-4 w-4" />
                        <span className="text-xs">{workspaceMembers.length}</span>
                        {pendingMembers.length > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                            {pendingMembers.length}
                          </span>
                        )}
                      </Button>
                    }
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <Separator />

      {/* Tabs */}
      <div>
        <div className="py-4 md:py-6">
          <Tabs defaultValue="boards" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="boards">Bảng</TabsTrigger>
              <TabsTrigger value="members">Thành viên</TabsTrigger>
              {/* Chỉ hiện Settings nếu là Admin? (Hiện tại chưa check role admin, cứ để đó) */}
              <TabsTrigger value="settings">Cài đặt</TabsTrigger>
              <TabsTrigger value="activity">Hoạt động</TabsTrigger>
            </TabsList>

            {/* Content */}
            <div className="py-6">
              <TabsContent value="boards" className="space-y-6">
                <WorkspaceBoards workspace={workspace} readOnly={readOnly} />
              </TabsContent>

              <TabsContent value="members" className="space-y-6">
                <WorkspaceMembers workspace={workspace} readOnly={readOnly} />
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                {!readOnly ? (
                     <WorkspaceSettings workspace={workspace} />
                ) : (
                    <div className="text-center text-muted-foreground p-4">Bạn không có quyền cài đặt workspace này.</div>
                )}
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <WorkspaceActivity workspace={workspace} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
