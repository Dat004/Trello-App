import RequestAccessDialog from "@/Components/RequestAccessDialog";
import { useWorkspaceDetail } from "@/features/workspaces/api/useWorkspaceDetail";
import { Loader2 } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { useParams } from "react-router-dom";

const WorkspaceContext = createContext(null);

export const useWorkspaceContext = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceAccessGuard');
  }
  return context;
};

export function WorkspaceAccessGuard({ children }) {
  const { id } = useParams();
  const { data, isLoading, error } = useWorkspaceDetail(id);
  const [showRequestDialog, setShowRequestDialog] = useState(true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check if error is specifically about permissions or not found, 
  // though backend usually returns success: false with specific message
  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full gap-4">
        <h2 className="text-2xl font-bold">Không thể tải Workspace</h2>
        <p className="text-muted-foreground">{error?.message || 'Workspace không tồn tại hoặc bạn không có quyền truy cập.'}</p>
      </div>
    );
  }

  const { workspace, is_member, read_only, has_pending_request, requested_at } = data;

  // Case 1 & 2: Member or Public (Read-Only) -> Show Dashboard
  if (is_member || read_only) {
    return (
      <WorkspaceContext.Provider value={{ 
        workspace, 
        isMember: is_member, 
        readOnly: !!read_only,
      }}>
        {children}
      </WorkspaceContext.Provider>
    );
  }

  // Case 3: Private & Non-Member -> Show Request Access Dialog
  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <RequestAccessDialog
        entity={workspace}
        type="workspace"
        open={showRequestDialog}
        onOpenChange={(open) => !open && window.history.back()}
        hasPendingRequest={has_pending_request}
        requested_at={requested_at}
      />
    </div>
  );
}
