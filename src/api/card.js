import { axiosClient } from "./axiosClient";

const membersRoute = "/members";
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
  async updateComplete(boardId, listId, id, data) {
    try {
      return await axiosClient.patch(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${id}/due_complete`, data);
    } catch (err) {
      return err.response;
    }
  },
  async move(boardId, listId, id, data) {
    try {
      return await axiosClient.patch(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${id}/move`, data);
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

  // Checklist
  async addChecklist(boardId, listId, id, data) {
    try {
      return await axiosClient.post(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${id}/checklist`, data);
    } catch (err) {
      return err.response;
    }
  },
  async toggleChecklistItem(boardId, listId, id, data) {
    try {
      return await axiosClient.patch(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${id}/checklist`, data);
    } catch (err) {
      return err.response;
    }
  },
  async deleteChecklist(boardId, listId, id, data) {
    try {
      return await axiosClient.delete(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${id}/checklist`, {
        data: data || {},
      });
    } catch (err) {
      return err.response;
    }
  },

  // Member
  async getMembersInCard(boardId, listId, cardId) {
    try {
      return await axiosClient.get(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${cardId}${membersRoute}`);
    } catch (err) {
      return err.response;
    }
  },
  async assignMemberToCard(boardId, listId, cardId, data) {
    try {
      return await axiosClient.post(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${cardId}${membersRoute}`, data);
    } catch (err) {
      return err.response;
    }
  },
  async unassignMemberFromCard(boardId, listId, cardId, userId) {
    try {
      return await axiosClient.delete(`${boardsRoute}/${boardId}${listsRoute}/${listId}${cardsRoute}/${cardId}${membersRoute}/${userId}`);
    } catch (err) {
      return err.response;
    }
  },
};
