import { create } from "zustand";

const useWorkspaceStore = create((set) => ({
  workspaces: [],
  loading: true,
  membersMap: {},
  joinRequestsMap: {},

  setWorkspaces: (workspaces) =>
    set((state) => {
      const membersMap = { ...state.membersMap };
      const joinRequestsMap = { ...state.joinRequestsMap };

      workspaces.forEach((ws) => {
        // Khởi tạo data ban đầu từ workspace object
        if (ws.members) membersMap[ws._id] = ws.members;
        if (ws.join_requests) joinRequestsMap[ws._id] = ws.join_requests;
      });

      return {
        workspaces,
        membersMap,
        joinRequestsMap,
        loading: false,
      };
    }),

  // Members
  setMembers: (workspaceId, members) =>
    set((state) => ({
      membersMap: {
        ...state.membersMap,
        [workspaceId]: members,
      },
    })),

  updateMemberInStore: (workspaceId, memberId, updatedData) =>
    set((state) => ({
      membersMap: {
        ...state.membersMap,
        [workspaceId]: state.membersMap[workspaceId]?.map((m) =>
          m._id === memberId ? { ...m, ...updatedData } : m
        ),
      },
    })),

  removeMemberFromStore: (workspaceId, memberId) =>
    set((state) => ({
      membersMap: {
        ...state.membersMap,
        [workspaceId]: state.membersMap[workspaceId]?.filter(
          (m) => m._id !== memberId
        ),
      },
    })),

  // Join Requests
  setJoinRequests: (workspaceId, requests) =>
    set((state) => ({
      joinRequestsMap: {
        ...state.joinRequestsMap,
        [workspaceId]: requests,
      },
    })),

  removeJoinRequestFromStore: (workspaceId, requestId) =>
    set((state) => ({
      joinRequestsMap: {
        ...state.joinRequestsMap,
        [workspaceId]: state.joinRequestsMap[workspaceId]?.filter(
          (r) => r._id !== requestId
        ),
      },
    })),

  addWorkspace: (workspace) =>
    set((state) => {
      const membersMap = { ...state.membersMap };
      const joinRequestsMap = { ...state.joinRequestsMap };

      if (workspace.members) membersMap[workspace._id] = workspace.members;
      if (workspace.join_requests) joinRequestsMap[workspace._id] = workspace.join_requests;

      return {
        workspaces: [workspace, ...state.workspaces],
        membersMap,
        joinRequestsMap,
      };
    }),

  updateWorkspace: (workspace) =>
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws._id === workspace._id ? workspace : ws
      ),
    })),

  removeWorkspace: (workspaceId) =>
    set((state) => ({
      workspaces: [
        ...state.workspaces.filter((ws) => ws._id !== workspaceId),
      ],
    })),

  clearWorkspaces: () =>
    set(() => ({
      loading: false,
      workspaces: [],
      membersMap: {},
      joinRequestsMap: {},
    })),
}));

export default useWorkspaceStore;
