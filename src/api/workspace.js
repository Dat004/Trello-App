import { axiosClient } from "./axiosClient";

const workspacesRoute = "/workspaces";

export const workspaceApi = {
  async getMyWorkspaces() {
    try {
      return await axiosClient.get(workspacesRoute);
    } catch (err) {
      return err.response;
    }
  },
};
