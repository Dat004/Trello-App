import { axiosClient } from "./axiosClient";

const commentsRoute = "/comments";
const boardsRoute = "/boards";
const cardsRoute = "/cards";

export const commentsApi = {
    async getCommentsByCardId(boardId, cardId, limit = 10, skip = 0) {
        try {
            return await axiosClient.get(`${boardsRoute}/${boardId}${cardsRoute}/${cardId}${commentsRoute}`, {
                params: {
                    limit,
                    skip,
                },
            });
        } catch (err) {
            return err.response;
        }
    },
    async addComment(boardId, cardId, data) {
        try {
            return await axiosClient.post(`${boardsRoute}/${boardId}${cardsRoute}/${cardId}${commentsRoute}/create`, data);
        } catch (err) {
            return err.response;
        }
    },
    async getThreadComment(boardId, cardId, commentId) {
        try {
            return await axiosClient.get(`${boardsRoute}/${boardId}${cardsRoute}/${cardId}${commentsRoute}/${commentId}/thread`);
        } catch (err) {
            return err.response;
        }
    },
    async deleteComment(boardId, cardId, commentId, data) {
        try {
            return await axiosClient.delete(`${boardsRoute}/${boardId}${cardsRoute}/${cardId}${commentsRoute}/${commentId}`, {
                data: data || {},
            });
        } catch (err) {
            return err.response;
        }
    },
};
