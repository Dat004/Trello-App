import { axiosClient } from "./axiosClient";

const workspaceRoute = "/workspace";
const createRoute = "/create";
const boardsRoute = "/boards";

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
};
