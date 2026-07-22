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

/**
 * Unwraps a successful envelope then validates `data` with a Zod schema.
 * @template T
 * @param {{ data?: { success?: boolean, message?: string, data?: unknown } }} response
 * @param {{ safeParse: (value: unknown) => { success: true, data: T } | { success: false, error: unknown } }} schema
 * @param {string} fallback
 * @returns {T}
 */
export function parseApiData(
  response,
  schema,
  fallback = "Phản hồi không hợp lệ",
) {
  const data = unwrapApiData(response, fallback);
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      fallback === response?.data?.message
        ? "Phản hồi không hợp lệ"
        : fallback,
    );
  }
  return parsed.data;
}
