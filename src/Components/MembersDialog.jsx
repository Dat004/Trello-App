import { Check, Users, X } from "lucide-react"
import { useState } from "react"

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
import { getRoleText, getRoleVariant } from "@/helpers/role"
import { PendingRequestsSkeleton, WorkspaceMembersSkeleton } from "./UI/LoadingSkeleton"

function MembersDialog({ 
  type = 'workspace', 
  entity, 
  members = [], 
  pendingMembers = [],
  isLoading = false,
  onAcceptRequest,
  onRejectRequest,
  trigger 
}) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState("active")

  const isWorkspace = type === 'workspace';
  const entityName = isWorkspace ? entity?.name : entity?.title;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users className="h-5 w-5 text-primary" />
            Thành viên của {entityName}
          </DialogTitle>
          <DialogDescription className="text-sm mt-1">
            {isWorkspace && tab === "active" && `Tổng số thành viên: ${members.length}`}
            {isWorkspace && tab === "pending" && `Tổng số người chờ xác nhận: ${pendingMembers.length}`}
            {!isWorkspace && `Tổng số thành viên: ${members.length}`}
          </DialogDescription>
        </DialogHeader>

        {isWorkspace ? (
          <Tabs defaultValue={tab} onValueChange={(value) => setTab(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active" className="flex items-center gap-2">
                Thành viên <Badge variant="secondary" className="py-0 ml-1">{members.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                Chờ xác nhận <Badge variant="secondary" className="py-0 ml-1">{pendingMembers.length}</Badge>
              </TabsTrigger>
            </TabsList>

            {/* Active Members Tab */}
            <TabsContent value="active" className="space-y-0">
              {isLoading ? (
                <WorkspaceMembersSkeleton />
              ) : members.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Chưa có thành viên nào</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-2">
                  {members.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 border border-border/50"
                    >
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-10 w-10 ring-2 ring-background">
                          <AvatarImage src={member.user.avatar.url} alt={member.user.full_name} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold text-sm">
                            {member.user.full_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{member.user.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
                      </div>

                      <Badge variant={getRoleVariant(member.role)}>
                          {getRoleText(member.role, member.user._id, entity.owner)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Pending Members Tab */}
            <TabsContent value="pending" className="space-y-0">
              {isLoading ? (
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
                      <Avatar className="h-10 w-10 ring-2 ring-background">
                          <AvatarImage src={member.user.avatar.url} alt={member.user.full_name} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold text-sm">
                            {member.user.full_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{member.user.full_name}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                              size="sm"
                              variant="default"
                              className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => onAcceptRequest?.(member._id)}
                              title="Chấp nhận"
                          >
                              <Check className="h-4 w-4" />
                          </Button>
                          <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 text-destructive hover:bg-destructive/10 bg-transparent"
                              onClick={() => onRejectRequest?.(member._id)}
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
        ) : (
          // Board Members - No Tabs
          <div className="space-y-0">
            {members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Chưa có thành viên nào</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-2">
                {members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 border border-border/50"
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-10 w-10 ring-2 ring-background">
                        <AvatarImage src={member.user.avatar.url} alt={member.user.full_name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold text-sm">
                          {member.user.full_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{member.user.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
                    </div>

                    <Badge variant={getRoleVariant(member.role)}>
                        {getRoleText(member.role, member.user._id, entity.owner)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default MembersDialog;
