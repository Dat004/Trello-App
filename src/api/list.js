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
  async create(data) {
    try {
      return await axiosClient.post(`${listsRoute}/create`, data);
    } catch (err) {
      return err.response;
    }
  },
  async update(id, data) {
    try {
      return await axiosClient.patch(`${listsRoute}/${id}`, data);
    } catch (err) {
      return err.response;
    }
  },
  async delete(id, data) {
    try {
      return await axiosClient.delete(`${listsRoute}/${id}`, {
        data: data || {},
      });
    } catch (err) {
      return err.response;
    }
  },
};