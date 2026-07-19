import { AlertCircle, Building2, Search, Shield, Users } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/UI";
import { MembersSkeleton } from "@/Components/UI/LoadingSkeleton";
import { useMemberDirectory } from "@/features/members/api/useMemberDirectory";

const roleLabels = {
  owner: "Chủ sở hữu",
  admin: "Quản trị",
  member: "Thành viên",
  viewer: "Chỉ xem",
};

function Members() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [workspaceId, setWorkspaceId] = useState("all");
  const { data: workspaces = [], isLoading, isError, error, refetch } = useMemberDirectory();

  const visibleWorkspaces = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("vi");
    return workspaces
      .filter((workspace) => workspaceId === "all" || workspace._id === workspaceId)
      .map((workspace) => ({
        ...workspace,
        members: workspace.members.filter((member) => {
          const matchesSearch = !normalizedSearch
            || member.full_name?.toLocaleLowerCase("vi").includes(normalizedSearch)
            || member.email?.toLocaleLowerCase("vi").includes(normalizedSearch);
          return matchesSearch && (role === "all" || member.role === role);
        }),
      }))
      .filter((workspace) => workspace.members.length > 0);
  }, [role, search, workspaceId, workspaces]);

  const uniqueMembers = useMemo(
    () => new Set(workspaces.flatMap((workspace) => workspace.members.map((member) => member._id))).size,
    [workspaces],
  );
  const memberships = workspaces.reduce((count, workspace) => count + workspace.members.length, 0);

  if (isLoading) {
    return (
      <div aria-live="polite">
        <h1 className="mb-6 text-2xl font-bold">Thành viên</h1>
        <MembersSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="mx-auto max-w-xl border-destructive/40">
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <h1 className="text-xl font-semibold">Không thể tải thành viên</h1>
          <p className="text-sm text-muted-foreground">{error?.message}</p>
          <Button onClick={() => refetch()}>Thử lại</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Thành viên</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Directory theo các workspace bạn đang tham gia
        </p>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-3" aria-label="Tổng quan thành viên">
        <SummaryCard icon={<Users className="h-5 w-5" />} label="Thành viên duy nhất" value={uniqueMembers} />
        <SummaryCard icon={<Building2 className="h-5 w-5" />} label="Workspace" value={workspaces.length} />
        <SummaryCard icon={<Shield className="h-5 w-5" />} label="Lượt membership" value={memberships} />
      </section>

      <section className="mb-6 flex flex-col gap-3 lg:flex-row" aria-label="Bộ lọc directory">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Tìm thành viên"
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={workspaceId} onValueChange={setWorkspaceId}>
          <SelectTrigger className="w-full lg:w-56" aria-label="Lọc theo workspace">
            <SelectValue placeholder="Workspace" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả workspace</SelectItem>
            {workspaces.map((workspace) => (
              <SelectItem key={workspace._id} value={workspace._id}>{workspace.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full lg:w-48" aria-label="Lọc theo vai trò">
            <SelectValue placeholder="Vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            {Object.entries(roleLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      {workspaces.length === 0 ? (
        <EmptyState title="Chưa có workspace" description="Tham gia một workspace để xem directory thành viên." />
      ) : visibleWorkspaces.length === 0 ? (
        <EmptyState title="Không tìm thấy thành viên" description="Hãy thử thay đổi từ khóa hoặc bộ lọc." />
      ) : (
        <div className="space-y-5">
          {visibleWorkspaces.map((workspace) => (
            <Card key={workspace._id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className={`h-3 w-3 rounded-full ${workspace.color || "bg-primary"}`} />
                  {workspace.name}
                </CardTitle>
                <CardDescription>{workspace.members.length} kết quả</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {workspace.members.map((member) => (
                  <article key={member._id} className="flex items-center gap-3 rounded-lg border p-3">
                    <Avatar className="h-11 w-11">
                      <AvatarImage src={member.avatar?.url} alt={member.full_name} />
                      <AvatarFallback>{member.full_name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{member.full_name}</p>
                      <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{roleLabels[member.role] || member.role}</Badge>
                        <span className="text-xs text-muted-foreground">{member.boardsCount} bảng</span>
                      </div>
                    </div>
                  </article>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

function SummaryCard({ icon, label, value }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ title, description }) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-12 text-center">
        <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default Members;
