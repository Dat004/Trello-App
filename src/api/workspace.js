import { axiosClient } from "./axiosClient";

const creatWorkspaceRoute = "/workspaces/create";
const workspacesRoute = "/workspaces";

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
  }
};
