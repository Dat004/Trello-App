import { axiosClient } from "./axiosClient";

const createRoute = "/create";
const boardsRoute = "/boards";

export const boardApi = {
  async getMyBoards() {
    try {
      return await axiosClient.get(boardsRoute);
    } catch (err) {
      return err.response;
    }
  },
  async create(data) {
    try {
      return await axiosClient.post(`${boardsRoute}${createRoute}`, data);
    } catch (err) {
      return err.response;
    }
  },
};
