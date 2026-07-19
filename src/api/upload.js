import { axiosClient, axiosCloudinaryClient } from "./axiosClient";

const CLOUDINARY_NAME = import.meta.env.VITE_CLOUDINARY_NAME;
const getSignatureRoute = "/upload/signature";

export const uploadApi = {
  async getSignature(data) {
    return await axiosClient.post(getSignatureRoute, data);
  },
  async uploadToCloudinary({ data, cloudName = CLOUDINARY_NAME, resource_type = "image" }) {
    return await axiosCloudinaryClient.post(
      `/${cloudName}/${resource_type}/upload`,
      data
    );
  },
};
