import { axiosClient } from "./axiosClient";

const boardsRoute = "/boards";
const listsRoute = "/lists";
const cardsRoute = "/cards";

export const cardApi = {
  async create(boardId, listId, data) {
    try {
      return await axiosClient.post(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/create`, data);
    } catch (err) {
      return err.response;
    }
  },
  async update(boardId, listId, id, data) {
    try {
      return await axiosClient.patch(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${id}`, data);
    } catch (err) {
      return err.response;
    }
  },
  async delete(boardId, listId, id, data) {
    try {
      return await axiosClient.delete(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${id}`, {
        data: data || {},
      });
    } catch (err) {
      return err.response;
    }
  },
};
