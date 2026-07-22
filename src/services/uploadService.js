import { uploadApi } from "@/api/upload";
import { uploadSignatureContract } from "@/schemas/apiContracts";
import { parseApiData } from "@/utils/apiError";

export const uploadService = {
  async upload(file, intent, contextId) {
    const payload = { intent };
    if (contextId) {
      payload.contextId = contextId;
    }

    const signRes = await uploadApi.getSignature(payload);
    const {
      cloudName,
      resource_type,
      signature,
      timestamp,
      apiKey,
      params,
    } = parseApiData(
      signRes,
      uploadSignatureContract,
      "Chữ ký upload không hợp lệ",
    );

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);

    if (params?.folder) formData.append("folder", params.folder);
    if (params?.eager) formData.append("eager", params.eager);

    const res = await uploadApi.uploadToCloudinary({
      data: formData,
      cloudName,
      resource_type,
    });

    return res.data;
  },
};
