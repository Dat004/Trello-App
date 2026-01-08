import { axiosClient } from "./axiosClient";

const boardsRoute = "/boards";

export const boardApi = {
  async getMyBoards() {
    try {
      return await axiosClient.get(boardsRoute);
    } catch (err) {
      return err.response;
    }
  },
};
