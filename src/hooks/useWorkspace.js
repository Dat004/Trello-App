import { useWorkspaceStore } from "@/store";
import { UserToast } from "@/context/ToastContext";
import { workspaceApi } from "@/api/workspace";

function useWorkspace() {
  const addWorkspace = useWorkspaceStore((s) => s.addWorkspace);
  const updateWorkspaceInStore = useWorkspaceStore((s) => s.updateWorkspace);
  const { addToast } = UserToast();

  const createWorkspace = async (data) => {
    const res = await workspaceApi.create(data);
    if (res.data?.success) {
      addWorkspace(res.data.data.workspace);
    }

    addToast({
      type: res.data.success ? "success" : "error",
      title: res.data.message,
    });

    return res;
  };

  const updateWorkspace = async (id, data) => {
    const res = await workspaceApi.update(id, data);
    if (res.data?.success) {
      updateWorkspaceInStore(res.data.data.workspace);
    }

    addToast({
      type: res.data.success ? "success" : "error",
      title: res.data.message,
    });

    return res;
  };

  return { createWorkspace, updateWorkspace };
}

export default useWorkspace;
