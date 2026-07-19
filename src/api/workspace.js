import { axiosClient } from "./axiosClient";

const creatWorkspaceRoute = "/workspaces/create";
const memberRoleRoute = "/members/role";
const workspacesRoute = "/workspaces";
const membersRoute = "/members";
const boardsRoute = "/boards";
const joinRoute = "/join";

export const workspaceApi = {
  async getMyWorkspaces() {
    return await axiosClient.get(workspacesRoute);
  },
  async getWorkspaceById(id) {
    return await axiosClient.get(`${workspacesRoute}/${id}`);
  },
  async create(data) {
    return await axiosClient.post(creatWorkspaceRoute, data);
  },
  async update(id, data) {
    return await axiosClient.patch(`${workspacesRoute}/${id}`, data);
  },
  async delete(id) {
    return await axiosClient.delete(`${workspacesRoute}/${id}`);
  },
  async addBoardsToWorkspace(id, data) {
    return await axiosClient.post(`${workspacesRoute}/${id}${boardsRoute}`, data);
  },
  async removeBoardsFromWorkspace(id, data) {
    return await axiosClient.delete(`${workspacesRoute}/${id}${boardsRoute}`, {
      data,
    });
  },
  // MEMBERS
  async getMemberInWorkspace(id) {
    return await axiosClient.get(`${workspacesRoute}/${id}${membersRoute}`);
  },
  async updateMemberRole(id, data) {
    return await axiosClient.patch(
      `${workspacesRoute}/${id}${memberRoleRoute}`,
      data
    );
  },
  async kickMember(id, data) {
    return await axiosClient.delete(
      `${workspacesRoute}/${id}${membersRoute}`,
      {
        data,
      }
    );
  },
  // JOIN
  async getJoinRequests(id) {
    return await axiosClient.get(`${workspacesRoute}/${id}${joinRoute}`);
  },
  async joinWorkspace(id, data) {
    return await axiosClient.post(`${workspacesRoute}/${id}${joinRoute}`, data);
  },
  async handleJoinRequest(workspaceId, requestId, data) {
    return await axiosClient.patch(`${workspacesRoute}/${workspaceId}${joinRoute}/${requestId}`, data);
  }
};
