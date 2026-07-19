import { axiosClient } from "./axiosClient";

const boardsRoute = "/boards";
const listsRoute = "/lists";

export const listApi = {
  async getListInBoard(boardId) {
    return await axiosClient.get(`${boardsRoute}/${boardId}/lists`);
  },
  async create(boardId, data) {
    return await axiosClient.post(`${boardsRoute}/${boardId}${listsRoute}/create`, data);
  },
  async update(boardId, id, data) {
    return await axiosClient.patch(`${boardsRoute}/${boardId}${listsRoute}/${id}`, data);
  },
  async move(boardId, id, data) {
    return await axiosClient.patch(`${boardsRoute}/${boardId}${listsRoute}/${id}/move`, data);
  },
  async delete(boardId, id, data) {
    return await axiosClient.delete(`${boardsRoute}/${boardId}${listsRoute}/${id}`, {
      data: data || {},
    });
  },
};