import { axiosClient } from "./axiosClient";

const search = '/search';

export const searchApi = {
    async search(query, limit = 10) {
        try {
            return await axiosClient.get(search, {
                params: {
                    q: query,
                    limit,
                },
            });
        } catch (err) {
            return err.response;
        }
    }
};
