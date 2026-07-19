import { axiosClient } from "./axiosClient";

const membersRoute = "/members";
const boardsRoute = "/boards";
const listsRoute = "/lists";
const cardsRoute = "/cards";

export const cardApi = {
  async create(boardId, listId, data) {
    return await axiosClient.post(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/create`, data);
  },
  async update(boardId, listId, id, data) {
    return await axiosClient.patch(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${id}`, data);
  },
  async updateComplete(boardId, listId, id, data) {
    return await axiosClient.patch(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${id}/due_complete`, data);
  },
  async move(boardId, listId, id, data) {
    return await axiosClient.patch(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${id}/move`, data);
  },
  async delete(boardId, listId, id, data) {
    return await axiosClient.delete(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${id}`, {
      data: data || {},
    });
  },

  // Checklist
  async addChecklist(boardId, listId, id, data) {
    return await axiosClient.post(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${id}/checklist`, data);
  },
  async toggleChecklistItem(boardId, listId, id, data) {
    return await axiosClient.patch(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${id}/checklist`, data);
  },
  async deleteChecklist(boardId, listId, id, data) {
    return await axiosClient.delete(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${id}/checklist`, {
      data: data || {},
    });
  },

  // Member
  async getMembersInCard(boardId, listId, cardId) {
    return await axiosClient.get(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${cardId}${membersRoute}`);
  },
  async assignMemberToCard(boardId, listId, cardId, data) {
    return await axiosClient.post(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${cardId}${membersRoute}`, data);
  },
  async unassignMemberFromCard(boardId, listId, cardId, userId) {
    return await axiosClient.delete(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${cardId}${membersRoute}/${userId}`);
  },
};
