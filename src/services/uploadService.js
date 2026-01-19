import { uploadApi } from "@/api/upload";

export const uploadService = {
  async upload(file, intent) {
    const signRes = await uploadApi.getSignature({ intent });

    const {
      cloudName,
      resource_type,
      signature,
      timestamp,
      apiKey,
      params,
    } = signRes.data.data;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    
    if (params.folder) formData.append("folder", params.folder);
    if (params.eager) formData.append("eager", params.eager);

    const res = await uploadApi.uploadToCloudinary({
      data: formData,
      cloudName,
      resource_type,
    });

    return res.data;
  },
};

