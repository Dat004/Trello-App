/**
 * @typedef {Object} ApiErrorBody
 * @property {string=} message
 * @property {string=} code
 * @property {Record<string, string[]>=} errors
 */

/**
 * Returns a user-facing message for Axios errors, API envelopes and Errors.
 * @param {unknown} error
 * @param {string} fallback
 */
export function getApiErrorMessage(error, fallback = "Đã xảy ra lỗi") {
  if (typeof error === "string" && error) return error;

  if (error && typeof error === "object") {
    const candidate = /** @type {{
     *   message?: string,
     *   data?: ApiErrorBody,
     *   response?: { data?: ApiErrorBody }
     * }} */ (error);

    return (
      candidate.response?.data?.message ||
      candidate.data?.message ||
      candidate.message ||
      fallback
    );
  }

  return fallback;
}

/**
 * Enforces the API's `{ success, message, data }` response contract.
 * @template T
 * @param {{ data?: { success?: boolean, message?: string, data?: T } }} response
 * @param {string} fallback
 * @returns {T}
 */
export function unwrapApiData(response, fallback = "Yêu cầu không thành công") {
  if (!response?.data?.success) {
    throw new Error(response?.data?.message || fallback);
  }
  return response.data.data;
}
