import { ArrowLeft, Loader2, Share2, Star, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from 'react-router-dom'

import { useActivityStore, useAuthStore, useFavoritesStore, useWorkspaceStore } from "@/store"
import { useApiMutation, useFavorites, useSocket, useWorkspaceActivities } from "@/hooks"
import RequestWorkspaceAccessDialog from "@/Components/RequestWorkspaceAccessDialog"
import { ROOM_TYPES, SOCKET_EVENTS } from "@/constants/socketEvents"
import MembersDialog from "@/Components/MembersDialog"
import WorkspaceActivity from "./WorkspaceActivities"
import WorkspaceSettings from "./WorkspaceSettings"
import WorkspaceMembers from "./WorkspaceMembers"
import WorkspaceBoards from "./WorkspaceBoards"
import { workspaceApi } from "@/api/workspace"
import { cn } from "@/lib/utils"
import {
    Button,
    Separator,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/Components/UI'

function Workspace() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("boards");
  const [requested_at, setRequestedAt] = useState(null);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const user = useAuthStore((state) => state.user);
  const clearCurrentWorkspace = useWorkspaceStore((state) => state.clearCurrentWorkspace);
  const setCurrentWorkspace = useWorkspaceStore((state) => state.setCurrentWorkspace);
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const updateWorkspace = useWorkspaceStore((state) => state.updateWorkspace);
  const workspaceMembers = useWorkspaceStore(
    (state) => state.membersMap[currentWorkspace?._id],
    (a, b) => a === b
  ) || [];
  const pendingMembers = useWorkspaceStore(
    (state) => state.joinRequestsMap[currentWorkspace?._id],
    (a, b) => a === b
  ) || [];

  const favoriteWorkspaces = useFavoritesStore((state) => state.favoriteWorkspaces);
  const { toggleWorkspaceStar, isTogglingWorkspace  } = useFavorites();
  const { on, off, isConnected } = useSocket();
  const addWorkspaceActivity = useActivityStore((state) => state.addWorkspaceActivity);
  const clearWorkspaceActivities = useActivityStore((state) => state.clearWorkspaceActivities);

  const setMembers = useWorkspaceStore((state) => state.setMembers);
  const addMemberToStore = useWorkspaceStore((state) => state.addMemberToStore);
  const removeJoinRequestFromStore = useWorkspaceStore((state) => state.removeJoinRequestFromStore);

  const { mutate: handleJoinRequest } = useApiMutation(
    (requestId, data) => workspaceApi.handleJoinRequest(currentWorkspace._id, requestId, data),
  );

  // Pre-fetch activities
  useWorkspaceActivities(id);

  useEffect(() => {
    if (!id) {
      navigate("/workspaces");
    }

    const fetchWorkspace = async () => {
      setLoading(true);
      const res = await workspaceApi.getWorkspaceById(id);
      setLoading(false);

      if (res.data.success) {
        setCurrentWorkspace(res.data.data.workspace);

        if (res.data.data.hasOwnProperty('is_member')) {
          setIsMember(res.data.data.is_member);
          setRequestedAt(res.data.data.requested_at);
          setHasPendingRequest(res.data.data.has_pending_request);
          return;
        }

        setIsMember(true);
        setRequestedAt(null);
        setHasPendingRequest(false);
        updateWorkspace(res.data.data.workspace);
        setMembers(res.data.data.workspace._id, res.data.data.workspace.members);
        return;
      }

      navigate("/workspaces");
    }

    fetchWorkspace();

    return () => {
      clearCurrentWorkspace();
      clearWorkspaceActivities(id);
    }
  }, [id, user])

  // Socket: Listen workspace-specific events
  useEffect(() => {
    if (!currentWorkspace?._id || !isConnected) return;

    console.log("[Workspace] Setting up workspace-specific listeners for:", currentWorkspace._id);
    const handleActivityCreated = (activity) => {
      console.log("[Workspace] New activity received:", activity);
      addWorkspaceActivity(currentWorkspace._id, activity);
    };

    on(SOCKET_EVENTS.ACTIVITY_CREATED, handleActivityCreated);

    return () => {
      console.log("[Workspace] Cleaning up workspace-specific listeners");
      off(SOCKET_EVENTS.ACTIVITY_CREATED, handleActivityCreated);
    };
  }, [
    currentWorkspace?._id,
    isConnected,
    on,
    off,
    addWorkspaceActivity,
  ]);

  const handleAcceptRequest = async (requestId) => {
    const res = await handleJoinRequest(requestId, {
      status: "accepted"
    })

    if (res.success) {
      removeJoinRequestFromStore(currentWorkspace._id, requestId);
      addMemberToStore(currentWorkspace._id, res.data.member);
    }
  }

  const handleRejectRequest = async (requestId) => {
    const res = await handleJoinRequest(requestId, {
      status: "declined"
    })

    if (res.success) {
      removeJoinRequestFromStore(currentWorkspace._id, requestId);
    }
  }

  if (loading && !currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Đang tải...</h2>
          <p className="text-muted-foreground">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    )
  }

  if (!isMember && !loading) {
    return (
      <RequestWorkspaceAccessDialog
        workspace={currentWorkspace}
        requested_at={requested_at}
        hasPendingRequest={hasPendingRequest}
        open
      />
    )
  }

  const handleShareBoard = () => {
    setShowShareDialog(true)
  }

  const handleFilterBoard = () => {
    setShowFilterDialog(true)
  }

  const handleViewActivity = () => {
    setShowActivityDialog(true)
  }

  const handleBoardSettings = () => {
    setShowSettingsDialog(true)
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
                onClick={() => navigate(-1)}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-3 min-w-0">
                <div className={`h-10 w-10 rounded-lg ${currentWorkspace.color} flex items-center justify-center flex-shrink-0`}>
                </div>
                <div className="min-w-0">
                  <h1 className="font-semibold text-foreground truncate">{currentWorkspace.name}</h1>
                  <p className="text-xs text-muted-foreground truncate">{currentWorkspace.description}</p>
                </div>
              </div>
            </div>

            {/* Right: Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="ghost"
                disabled={isTogglingWorkspace}
                onClick={() => toggleWorkspaceStar(currentWorkspace)}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-200 gap-1 hidden sm:flex"
                title="Yêu thích"
              >
                {isTogglingWorkspace ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Star className={cn("h-4 w-4", favoriteWorkspaces.some((fw) => fw._id === currentWorkspace._id) ? "fill-yellow-400 text-yellow-400" : "")} />
                )}
                <span className="hidden md:inline text-xs">
                  {favoriteWorkspaces.some((fw) => fw._id === currentWorkspace._id) ? "Bỏ yêu thích" : "Yêu thích"}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-200 gap-1 hidden sm:flex"
                title="Chia sẻ"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden md:inline text-xs">Chia sẻ</span>
              </Button>

              <MembersDialog
                type="workspace"
                entity={currentWorkspace}
                members={workspaceMembers}
                pendingMembers={pendingMembers}
                onAcceptRequest={handleAcceptRequest}
                onRejectRequest={handleRejectRequest}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 dark:text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-200 gap-1"
                    title="Thành viên"
                  >
                    <Users className="h-4 w-4" />
                    <span className="text-xs">{workspaceMembers.length}</span>
                  </Button>
                }
              />
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
              <TabsTrigger value="settings">Cài đặt</TabsTrigger>
              <TabsTrigger value="activity">Hoạt động</TabsTrigger>
            </TabsList>

            {/* Content */}
            <div className="py-6">
              <TabsContent value="boards" className="space-y-6">
                <WorkspaceBoards workspace={currentWorkspace} />
              </TabsContent>

              <TabsContent value="members" className="space-y-6">
                <WorkspaceMembers workspace={currentWorkspace} />
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <WorkspaceSettings workspace={currentWorkspace} />
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <WorkspaceActivity workspace={currentWorkspace} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Workspace;
