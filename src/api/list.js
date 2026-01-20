import { axiosClient } from "./axiosClient";

const boardsRoute = "/boards";
const listsRoute = "/lists";

export const listApi = {
  async getListInBoard(boardId) {
    try {
      return await axiosClient.get(`${boardsRoute}/${boardId}/lists`);
    } catch (err) {
      return err.response;
    }
  },
  async create(boardId, data) {
    try {
      return await axiosClient.post(`${boardsRoute}/${boardId}${listsRoute}/create`, data);
    } catch (err) {
      return err.response;
    }
  },
  async update(boardId, id, data) {
    try {
      return await axiosClient.patch(`${boardsRoute}/${boardId}${listsRoute}/${id}`, data);
    } catch (err) {
      return err.response;
    }
  },
  async move(boardId, id, data) {
    try {
      return await axiosClient.patch(`${boardsRoute}/${boardId}${listsRoute}/${id}/move`, data);
    } catch (err) {
      return err.response;
    }
  },
  async delete(boardId, id, data) {
    try {
      return await axiosClient.delete(`${boardsRoute}/${boardId}${listsRoute}/${id}`, {
        data: data || {},
      });
    } catch (err) {
      return err.response;
    }
  },
};