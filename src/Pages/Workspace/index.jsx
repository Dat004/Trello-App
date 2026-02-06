import { ArrowLeft, Loader2, Share2, Star, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from 'react-router-dom'

import { useActivityStore, useAuthStore, useBoardStore, useFavoritesStore, useWorkspaceStore } from "@/store"
import { useFavorites, useSocket, useWorkspaceActivities, useApiMutation } from "@/hooks"
import RequestWorkspaceAccessDialog from "@/Components/RequestWorkspaceAccessDialog"
import { ROOM_TYPES, SOCKET_EVENTS } from "@/constants/socketEvents"
import MembersDialog from "@/Components/MembersDialog"
import WorkspaceActivity from "./WorkspaceActivities"
import WorkspaceSettings from "./WorkspaceSettings"
import { UserToast } from "@/context/ToastContext"
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
  const { addToast } = UserToast();
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
  const removeWorkspace = useWorkspaceStore((state) => state.removeWorkspace);
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
  const { joinRoom, leaveRoom, on, off, isConnected } = useSocket();
  const addWorkspaceActivity = useActivityStore((state) => state.addWorkspaceActivity);
  const clearWorkspaceActivities = useActivityStore((state) => state.clearWorkspaceActivities);

  const setMembers = useWorkspaceStore((state) => state.setMembers);
  const addMemberToStore = useWorkspaceStore((state) => state.addMemberToStore);
  const updateMemberInStore = useWorkspaceStore((state) => state.updateMemberInStore);
  const removeMemberFromStore = useWorkspaceStore((state) => state.removeMemberFromStore);
  const removeJoinRequestFromStore = useWorkspaceStore((state) => state.removeJoinRequestFromStore);
  const removeBoardsFromWorkspace = useWorkspaceStore((state) => state.removeBoardsFromWorkspace);
  const addJoinRequest = useWorkspaceStore((state) => state.addJoinRequest);

  const addBoard = useBoardStore((state) => state.addBoard);
  const updateBoard = useBoardStore((state) => state.updateBoard);
  const removeBoard = useBoardStore((state) => state.removeBoard);
  const mergeBoardsFromWorkspace = useBoardStore((state) => state.mergeBoardsFromWorkspace);

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

  // Socket: Join/Leave workspace room và listen events
  useEffect(() => {
    if (!currentWorkspace?._id || !isConnected) return;

    console.log("[Workspace] Joining workspace room:", currentWorkspace._id);
    joinRoom(ROOM_TYPES.WORKSPACE, currentWorkspace._id);

    // Listen for new activities Oke
    const handleActivityCreated = (activity) => {
      console.log("[Socket] New activity received:", activity);
      addWorkspaceActivity(currentWorkspace._id, activity);
    };

    // Listen for workspace updates Oke
    const handleWorkspaceUpdated = (updatedWorkspace) => {
      console.log("[Socket] Workspace updated:", updatedWorkspace);
      clearCurrentWorkspace();

      setCurrentWorkspace(updatedWorkspace);
      updateWorkspace(updatedWorkspace);
    };

    // Oke
    const handleWorkspacePermissionsUpdated = (permissions) => {
      console.log("[Socket] Workspace permissions updated:", permissions);
      clearCurrentWorkspace();

      const updatedWorkspace = { ...currentWorkspace, ...permissions };
      setCurrentWorkspace(updatedWorkspace);
      updateWorkspace(updatedWorkspace);
    };

    const handleWorkspaceDeleted = (workspaceId) => {
      console.log("[Socket] Workspace deleted:", workspaceId);
      removeWorkspace(workspaceId);

      if (workspaceId === currentWorkspace._id) {
        clearCurrentWorkspace();
        removeBoardsFromWorkspace(workspaceId);

        addToast({
          type: "warning",
          message: "Không gian làm việc này đã bị xóa"
        });

        navigate("/workspaces");
      }
    };

    // Member events Oke
    const handleMemberJoined = (member) => {
      console.log("[Socket] Member joined:", member);
      addMemberToStore(currentWorkspace._id, member);
    };

    // Oke
    const handleMemberRemoved = (member_id) => {
      console.log("[Socket] Member removed:", member_id);

      const targetMember = workspaceMembers.find((m) => m.user._id === member_id);
      if (targetMember) {
        removeMemberFromStore(currentWorkspace._id, targetMember._id);

        setIsMember(false);
        setRequestedAt(null);
        setHasPendingRequest(false);

        addToast({
          type: "warning",
          title: "Bạn đã bị xóa khỏi không gian làm việc"
        });
      }
    };

    // Oke
    const handleMemberRoleUpdated = ({ member_id, role }) => {
      console.log("[Socket] Member role updated:", { member_id, role });

      const targetMember = workspaceMembers.find((m) => m.user._id === member_id);
      if (targetMember) {
        updateMemberInStore(currentWorkspace._id, targetMember._id, { role });
      }
    };

    // Join request events Oke
    const handleJoinRequestReceived = (joinRequest) => {
      console.log("[Socket] Join request received:", joinRequest);
      addJoinRequest(currentWorkspace._id, joinRequest);
    };

    // Board events within workspace Oke
    const handleBoardCreated = (newBoard) => {
      console.log("[Socket] Board created:", newBoard);
      addBoard(newBoard);
      updateWorkspace({
        _id: currentWorkspace._id,
        board_count: currentWorkspace.board_count + 1
      })
    };

    // Oke
    const handleBoardUpdated = (updatedBoard) => {
      console.log("[Socket] Board updated:", updatedBoard);
      updateBoard(updatedBoard);
    };

    // Oke
    const handleBoardDeleted = (boardId) => {
      console.log("[Socket] Board deleted:", boardId);
      removeBoard(boardId);
      updateWorkspace({
        _id: currentWorkspace._id,
        board_count: Math.max(currentWorkspace.board_count - 1, 0)
      })
    };

    // Oke
    const handleBoardsAdded = (boards) => {
      console.log("[Socket] Boards added:", boards);
      mergeBoardsFromWorkspace(boards);
      updateWorkspace({
        _id: currentWorkspace._id,
        board_count: currentWorkspace.board_count + boards.length
      })
    };

    const handleBoardsRemoved = (boardIds) => {
      console.log("[Socket] Boards removed:", boardIds);
      boardIds.forEach(boardId => {
        removeBoard(boardId);
      })
    };

    // Listen socket events
    on(SOCKET_EVENTS.ACTIVITY_CREATED, handleActivityCreated);
    on(SOCKET_EVENTS.WORKSPACE_UPDATED, handleWorkspaceUpdated);
    on(SOCKET_EVENTS.WORKSPACE_PERMISSIONS_UPDATED, handleWorkspacePermissionsUpdated);
    on(SOCKET_EVENTS.WORKSPACE_DELETED, handleWorkspaceDeleted);
    on(SOCKET_EVENTS.MEMBER_JOINED, handleMemberJoined);
    on(SOCKET_EVENTS.MEMBER_REMOVED, handleMemberRemoved);
    on(SOCKET_EVENTS.MEMBER_ROLE_UPDATED, handleMemberRoleUpdated);
    on(SOCKET_EVENTS.JOIN_REQUEST_RECEIVED, handleJoinRequestReceived);
    on(SOCKET_EVENTS.BOARD_CREATED, handleBoardCreated);
    on(SOCKET_EVENTS.BOARD_UPDATED_IN_WORKSPACE, handleBoardUpdated);
    on(SOCKET_EVENTS.BOARD_DELETED, handleBoardDeleted);
    on(SOCKET_EVENTS.BOARDS_ADDED, handleBoardsAdded);
    on(SOCKET_EVENTS.BOARDS_REMOVED, handleBoardsRemoved);

    return () => {
      console.log("[Workspace] Leaving workspace room:", currentWorkspace._id);
      off(SOCKET_EVENTS.ACTIVITY_CREATED, handleActivityCreated);
      off(SOCKET_EVENTS.WORKSPACE_UPDATED, handleWorkspaceUpdated);
      off(SOCKET_EVENTS.WORKSPACE_PERMISSIONS_UPDATED, handleWorkspacePermissionsUpdated);
      off(SOCKET_EVENTS.WORKSPACE_DELETED, handleWorkspaceDeleted);
      off(SOCKET_EVENTS.MEMBER_JOINED, handleMemberJoined);
      off(SOCKET_EVENTS.MEMBER_REMOVED, handleMemberRemoved);
      off(SOCKET_EVENTS.MEMBER_ROLE_UPDATED, handleMemberRoleUpdated);
      off(SOCKET_EVENTS.JOIN_REQUEST_RECEIVED, handleJoinRequestReceived);
      off(SOCKET_EVENTS.BOARD_CREATED, handleBoardCreated);
      off(SOCKET_EVENTS.BOARD_UPDATED_IN_WORKSPACE, handleBoardUpdated);
      off(SOCKET_EVENTS.BOARD_DELETED, handleBoardDeleted);
      off(SOCKET_EVENTS.BOARDS_ADDED, handleBoardsAdded);
      off(SOCKET_EVENTS.BOARDS_REMOVED, handleBoardsRemoved);

      leaveRoom(ROOM_TYPES.WORKSPACE, currentWorkspace._id);
    };
  }, [
    currentWorkspace?._id,
    isConnected,
    joinRoom,
    leaveRoom,
    on,
    off,
    addWorkspaceActivity,
    updateWorkspace,
    setCurrentWorkspace,
    setMembers,
    updateMemberInStore,
    addBoard,
    updateBoard,
    removeBoard,
    mergeBoardsFromWorkspace,
    addToast,
    navigate
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
