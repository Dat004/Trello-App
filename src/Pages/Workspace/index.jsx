import { WorkspaceAccessGuard } from "@/features/workspaces/components/WorkspaceAccessGuard";
import WorkspaceContent from "@/features/workspaces/components/Detail/WorkspaceContent";

export default function WorkspacePage() {
  return (
    <WorkspaceAccessGuard>
      <WorkspaceContent />
    </WorkspaceAccessGuard>
  );
}
