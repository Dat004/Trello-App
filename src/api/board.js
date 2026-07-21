import { axiosClient } from "./axiosClient";

const memberRoleRoute = "/members/role";
const workspaceRoute = "/workspace";
const membersRoute = "/members";
const createRoute = "/create";
const boardsRoute = "/boards";
const joinRoute = "/join";

export const boardApi = {
  async getMyBoards() {
    return await axiosClient.get(boardsRoute);
  },
  async getArchivedBoards() {
    return await axiosClient.get(`${boardsRoute}/archived`);
  },
  async getBoardsInWorkspace(workspaceId) {
    return await axiosClient.get(`${boardsRoute}${workspaceRoute}/${workspaceId}`);
  },
  async create(data) {
    return await axiosClient.post(`${boardsRoute}${createRoute}`, data);
  },
  async update(id, data) {
    return await axiosClient.patch(`${boardsRoute}/${id}`, data);
  },
  async delete(id, data) {
    return await axiosClient.delete(`${boardsRoute}/${id}`, {
      data: data || {},
    });
  },
  async archive(id) {
    return await axiosClient.patch(`${boardsRoute}/${id}/archive`);
  },
  async unarchive(id) {
    return await axiosClient.patch(`${boardsRoute}/${id}/unarchive`);
  },
  async detailBoard(id) {
    return await axiosClient.get(`${boardsRoute}/${id}`);
  },

  // MEMBERS
  async updateMemberRole(id, data) {
    return await axiosClient.patch(
      `${boardsRoute}/${id}${memberRoleRoute}`,
      data
    );
  },
  async kickMember(id, data) {
    return await axiosClient.delete(
      `${boardsRoute}/${id}${membersRoute}`,
      {
        data,
      }
    );
  },
  // JOIN
  async getJoinRequests(id) {
    return await axiosClient.get(`${boardsRoute}/${id}${joinRoute}`);
  },
  async joinBoard(id, data) {
    return await axiosClient.post(`${boardsRoute}/${id}${joinRoute}`, data);
  },
  async handleJoinRequest(boardId, requestId, data) {
    return await axiosClient.patch(`${boardsRoute}/${boardId}${joinRoute}/${requestId}`, data);
  },

  // LABELS
  async createLabel(boardId, data) {
    return await axiosClient.post(`${boardsRoute}/${boardId}/labels`, data);
  },
  async updateLabel(boardId, labelId, data) {
    return await axiosClient.patch(`${boardsRoute}/${boardId}/labels/${labelId}`, data);
  },
  async deleteLabel(boardId, labelId) {
    return await axiosClient.delete(`${boardsRoute}/${boardId}/labels/${labelId}`);
  },
};
