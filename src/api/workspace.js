import { axiosClient } from "./axiosClient";

const creatWorkspaceRoute = "/workspaces/create";
const memberRoleRoute = "/members/role";
const workspacesRoute = "/workspaces";
const membersRoute = "/members";
const boardsRoute = "/boards";
const joinRoute = "/join";

export const workspaceApi = {
  async getMyWorkspaces() {
    try {
      return await axiosClient.get(workspacesRoute);
    } catch (err) {
      return err.response;
    }
  },
  async getWorkspaceById(id) {
    try {
      return await axiosClient.get(`${workspacesRoute}/${id}`);
    } catch (err) {
      return err.response;
    }
  },
  async create(data) {
    try {
      return await axiosClient.post(creatWorkspaceRoute, data);
    } catch (err) {
      return err.response;
    }
  },
  async update(id, data) {
    try {
      return await axiosClient.patch(`${workspacesRoute}/${id}`, data);
    } catch (err) {
      return err.response;
    }
  },
  async delete(id) {
    try {
      return await axiosClient.delete(`${workspacesRoute}/${id}`);
    } catch (err) {
      return err.response;
    }
  },
  async addBoardsToWorkspace(id, data) {
    try {
      return await axiosClient.post(`${workspacesRoute}/${id}${boardsRoute}`, data);
    } catch (err) {
      return err.response;
    }
  },
  async removeBoardsFromWorkspace(id, data) {
    try {
      return await axiosClient.delete(`${workspacesRoute}/${id}${boardsRoute}`, {
        data,
      });
    } catch (err) {
      return err.response;
    }
  },
  // MEMBERS
  async getMemberInWorkspace(id) {
    try {
      return await axiosClient.get(`${workspacesRoute}/${id}${membersRoute}`);
    } catch (err) {
      return err.response;
    }
  },
  async updateMemberRole(id, data) {
    try {
      return await axiosClient.patch(
        `${workspacesRoute}/${id}${memberRoleRoute}`,
        data
      );
    } catch (err) {
      return err.response;
    }
  },
  async kickMember(id, data) {
    try {
      return await axiosClient.delete(
        `${workspacesRoute}/${id}${membersRoute}`,
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
      return await axiosClient.get(`${workspacesRoute}/${id}${joinRoute}`);
    } catch (err) {
      return err.response;
    }
  },
  async joinWorkspace(id, data) {
    try {
      return await axiosClient.post(`${workspacesRoute}/${id}${joinRoute}`, data);
    } catch (err) {
      return err.response;
    }
  },
  async handleJoinRequest(workspaceId, requestId, data) {
    try {
      return await axiosClient.patch(`${workspacesRoute}/${workspaceId}${joinRoute}/${requestId}`, data);
    } catch (err) {
      return err.response;
    }
  }
};
