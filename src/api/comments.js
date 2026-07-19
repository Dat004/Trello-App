import { axiosClient } from "./axiosClient";

const commentsRoute = "/comments";
const boardsRoute = "/boards";
const cardsRoute = "/cards";

export const commentsApi = {
    async getCommentsByCardId(boardId, cardId, limit = 10, skip = 0) {
        return await axiosClient.get(`${boardsRoute}/${boardId}${cardsRoute}/${cardId}${commentsRoute}`, {
            params: {
                limit,
                skip,
            },
        });
    },
    async addComment(boardId, cardId, data) {
        return await axiosClient.post(`${boardsRoute}/${boardId}${cardsRoute}/${cardId}${commentsRoute}/create`, data);
    },
    async getThreadComment(boardId, cardId, commentId) {
        return await axiosClient.get(`${boardsRoute}/${boardId}${cardsRoute}/${cardId}${commentsRoute}/${commentId}/thread`);
    },
    async deleteComment(boardId, cardId, commentId, data) {
        return await axiosClient.delete(`${boardsRoute}/${boardId}${cardsRoute}/${cardId}${commentsRoute}/${commentId}`, {
            data: data || {},
        });
    },
};
