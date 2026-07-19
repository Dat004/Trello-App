import { axiosClient } from "./axiosClient";

const search = '/search';

export const searchApi = {
    async search(query, limit = 10) {
        return await axiosClient.get(search, {
            params: {
                q: query,
                limit,
            },
        });
    }
};
