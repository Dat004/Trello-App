import { axiosClient } from "./axiosClient";

const creatWorkspaceRoute = "/workspaces/create";
const memberRoleRoute = "/members/role";
const workspacesRoute = "/workspaces";
const membersRoute = "/members";

export const workspaceApi = {
  async getMyWorkspaces() {
    try {
      return await axiosClient.get(workspacesRoute);
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
};
