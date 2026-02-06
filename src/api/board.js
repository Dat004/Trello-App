import { axiosClient } from "./axiosClient";

const memberRoleRoute = "/members/role";
const workspaceRoute = "/workspace";
const membersRoute = "/members";
const createRoute = "/create";
const boardsRoute = "/boards";
const joinRoute = "/join";

export const boardApi = {
  async getMyBoards() {
    try {
      return await axiosClient.get(boardsRoute);
    } catch (err) {
      return err.response;
    }
  },
  async getBoardsInWorkspace(workspaceId) {
    try {
      return await axiosClient.get(`${boardsRoute}${workspaceRoute}/${workspaceId}`);
    } catch (err) {
      return err.response;
    }
  },
  async create(data) {
    try {
      return await axiosClient.post(`${boardsRoute}${createRoute}`, data);
    } catch (err) {
      return err.response;
    }
  },
  async update(id, data) {
    try {
      return await axiosClient.patch(`${boardsRoute}/${id}`, data);
    } catch (err) {
      return err.response;
    }
  },
  async delete(id, data) {
    try {
      return await axiosClient.delete(`${boardsRoute}/${id}`, {
        data: data || {},
      });
    } catch (err) {
      return err.response;
    }
  },
  async detailBoard(id) {
    try {
      return await axiosClient.get(`${boardsRoute}/${id}`);
    } catch (err) {
      return err.response;
    }
  },

  // MEMBERS
  async updateMemberRole(id, data) {
    try {
      return await axiosClient.patch(
        `${boardsRoute}/${id}${memberRoleRoute}`,
        data
      );
    } catch (err) {
      return err.response;
    }
  },
  async kickMember(id, data) {
    try {
      return await axiosClient.delete(
        `${boardsRoute}/${id}${membersRoute}`,
        {
          data,
        }
      );
    } catch (err) {
      return err.response;
    }
  },
  // JOIN
  async getJoinRequests(id) {
    try {
      return await axiosClient.get(`${boardsRoute}/${id}${joinRoute}`);
    } catch (err) {
      return err.response;
    }
  },
  async joinWorkspace(id, data) {
    try {
      return await axiosClient.post(`${boardsRoute}/${id}${joinRoute}`, data);
    } catch (err) {
      return err.response;
    }
  },
  async handleJoinRequest(workspaceId, requestId, data) {
    try {
      return await axiosClient.patch(`${boardsRoute}/${workspaceId}${joinRoute}/${requestId}`, data);
    } catch (err) {
      return err.response;
    }
  }
};
