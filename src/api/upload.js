import { axiosClient, axiosCloudinaryClient } from "./axiosClient";

const CLOUDINARY_NAME = import.meta.env.VITE_CLOUDINARY_NAME;
const getSignatureRoute = "/upload/signature";

export const uploadApi = {
  async getSignature(data) {
    try {
      return await axiosClient.post(getSignatureRoute, data);
    } catch (err) {
      return err.response;
    }
  },
  async uploadToCloudinary({ data, cloudName = CLOUDINARY_NAME, resource_type = "image" }) {
    try {
      return await axiosCloudinaryClient.post(
        `/${cloudName}/${resource_type}/upload`,
        data
      );
    } catch (err) {
      return err.response;
    }
  },
};
