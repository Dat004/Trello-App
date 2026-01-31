import { Check, Users, X } from "lucide-react"
import { useEffect, useState } from "react"

import { PendingRequestsSkeleton, WorkspaceMembersSkeleton } from "./UI/LoadingSkeleton"
import { getRoleText, getRoleVariant } from "@/helpers/role"
import { workspaceApi } from "@/api/workspace"
import { useWorkspaceStore } from "@/store"
import { useApiMutation } from "@/hooks"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/UI"

function WorkspaceMembersDialog({ workspace, trigger }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState("active")
  const [isLoadingData, setIsLoadingData] = useState(false)

  // Global Store
  const allMembers = useWorkspaceStore(
    (state) => state.membersMap[workspace._id],
    (a, b) => a === b
  ) || [];
  const pendingMembers = useWorkspaceStore(
    (state) => state.joinRequestsMap[workspace._id],
    (a, b) => a === b
  ) || [];
  const setMembers = useWorkspaceStore((state) => state.setMembers);
  const addMemberToStore = useWorkspaceStore((state) => state.addMemberToStore);
  const setJoinRequests = useWorkspaceStore((state) => state.setJoinRequests);
  const removeJoinRequestFromStore = useWorkspaceStore((state) => state.removeJoinRequestFromStore);

  const { mutate: handleJoinRequest } = useApiMutation(
    (requestId, data) => workspaceApi.handleJoinRequest(workspace._id, requestId, data),
  );

  useEffect(() => {
    if (!open || !workspace) return;

    // Nếu đã có data thì không fetch lại
    const currentList = tab === "active" ? allMembers : pendingMembers;
    if (currentList.length > 0) return;

    const fetchMembers = async () => {
      setIsLoadingData(true);
      try {
        if (tab === "active") {
          const res = await workspaceApi.getMemberInWorkspace(workspace._id);
          if (res.data.success) {
            setMembers(workspace._id, res.data.data.members);
          }
        } else {
          const res = await workspaceApi.getJoinRequests(workspace._id);
          if (res.data.success) {
            setJoinRequests(workspace._id, res.data.data.join_requests);
          }
        }
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchMembers();
  }, [tab, open, workspace._id]); 

  const handleAccept = async (requestId) => {
    const res = await handleJoinRequest(requestId, {
      status: "accepted"
    })

    if (res.success) {
      removeJoinRequestFromStore(workspace._id, requestId);
      addMemberToStore(workspace._id, res.data.member);
    }
  }

  const handleReject = async (requestId) => {
    const res = await handleJoinRequest(requestId, {
      status: "declined"
    })

    if (res.success) {
      removeJoinRequestFromStore(workspace._id, requestId);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users className="h-5 w-5 text-primary" />
            Thành viên của {workspace.name}
          </DialogTitle>
          <DialogDescription className="text-sm mt-1">
            {tab === "active" ? "Tổng số thành viên: " : "Tổng số người chờ xác nhận: "}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={tab} onValueChange={(value) => setTab(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-2">
              Thành viên <Badge variant="secondary" className="py-0 ml-1">{allMembers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              Chờ xác nhận <Badge variant="secondary" className="py-0 ml-1">{pendingMembers.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Active Members Tab */}
          <TabsContent value="active" className="space-y-0">
            {isLoadingData ? (
              <WorkspaceMembersSkeleton />
            ) : allMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Chưa có thành viên nào</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-2">
                {allMembers.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 border border-border/50"
                  >
                    {/* Avatar with status dot */}
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-10 w-10 ring-2 ring-background">
                        <AvatarImage src={member.user.avatar.url} alt={member.user.full_name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold text-sm">
                          {member.user.full_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute hidden bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background" />
                    </div>

                    {/* Name and Email */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{member.user.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
                    </div>

                    {/* Role Badge */}
                    <Badge variant={getRoleVariant(member.role)}>
                        {getRoleText(member.role, member.user._id, workspace.owner)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pending Members Tab */}
          <TabsContent value="pending" className="space-y-0">
            {isLoadingData ? (
              <PendingRequestsSkeleton />
            ) : pendingMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Không có yêu cầu nào đang chờ</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-2">
                {pendingMembers.map((member) => (
                    <div
                    key={member._id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 border border-transparent hover:border-border/50"
                    >
                    {/* Avatar */}
                    <Avatar className="h-10 w-10 ring-2 ring-background">
                        <AvatarImage src={member.user.avatar.url} alt={member.user.full_name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold text-sm">
                          {member.user.full_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    {/* Name and Email */}
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{member.user.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
                    </div>

                    {/* Accept/Reject Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                            size="sm"
                            variant="default"
                            className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleAccept(member._id)}
                            title="Chấp nhận"
                        >
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-destructive hover:bg-destructive/10 bg-transparent"
                            onClick={() => handleReject(member._id)}
                            title="Từ chối"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default WorkspaceMembersDialog;
