import { axiosClient } from "./axiosClient";

const attachmentsRoute = "/attachments";
const boardsRoute = "/boards";
const cardsRoute = "/cards";

export const attachmentsApi = {
    async getAttachmentsByCardId(boardId, cardId, limit = 10, skip = 0) {
        try {
            return await axiosClient.get(`${boardsRoute}/${boardId}${cardsRoute}/${cardId}${attachmentsRoute}`, {
                params: {
                    limit,
                    skip,
                },
            });
        } catch (err) {
            return err.response;
        }
    },
    async addAttachment(boardId, cardId, data) {
        try {
            return await axiosClient.post(`${boardsRoute}/${boardId}${cardsRoute}/${cardId}${attachmentsRoute}/create`, data);
        } catch (err) {
            return err.response;
        }
    },
    async deleteAttachment(boardId, cardId, attachmentId, data) {
        try {
            return await axiosClient.delete(`${boardsRoute}/${boardId}${cardsRoute}/${cardId}${attachmentsRoute}/${attachmentId}`, {
                data: data || {},
            });
        } catch (err) {
            return err.response;
        }
    },
};
