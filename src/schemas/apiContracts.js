import { z } from "zod";

/**
 * Runtime contracts for high-risk API response payloads.
 * Schemas are intentionally loose (passthrough) so extra server fields survive,
 * while required identity fields fail closed when missing or malformed.
 */

const id = z.string().min(1);

export const userContract = z
  .object({
    _id: id,
    email: z.string().nullable().optional(),
    full_name: z.string().nullable().optional(),
    // API returns { url, public_id } (or occasionally a legacy string URL).
    avatar: z
      .union([
        z.string(),
        z
          .object({
            url: z.string().nullable().optional(),
            public_id: z.string().nullable().optional(),
          })
          .passthrough(),
      ])
      .nullable()
      .optional(),
  })
  .passthrough();

export const cardContract = z
  .object({
    _id: id,
    title: z.string().optional(),
    list: z
      .union([id, z.object({ _id: id }).passthrough()])
      .optional(),
    listId: id.optional(),
    pos: z.number().optional(),
  })
  .passthrough();

/** GET /boards/:id → `data` */
export const boardDetailContract = z
  .object({
    board: z
      .object({
        _id: id,
        title: z.string().optional(),
        lists: z.array(z.any()).optional(),
        members: z.array(z.any()).optional(),
      })
      .passthrough(),
    is_member: z.boolean().optional(),
    read_only: z.boolean().optional(),
  })
  .passthrough();

/** Auth login / register / me → `data` */
export const authUserDataContract = z
  .object({
    user: userContract,
  })
  .passthrough();

/** Card create / update → `data` */
export const cardMutationDataContract = z
  .object({
    card: cardContract,
  })
  .passthrough();

/** POST /uploads/signature → `data` */
export const uploadSignatureContract = z
  .object({
    cloudName: z.string().min(1),
    resource_type: z.string().min(1),
    signature: z.string().min(1),
    timestamp: z.union([z.number(), z.string()]),
    apiKey: z.string().min(1),
    params: z
      .object({
        folder: z.string().optional(),
        eager: z.string().optional(),
      })
      .passthrough()
      .optional()
      .default({}),
  })
  .passthrough();

/** GET /notifications → `data` */
export const notificationsPageContract = z
  .object({
    notifications: z.array(z.object({ _id: id }).passthrough()),
    pagination: z
      .object({
        page: z.number(),
        limit: z.number(),
        total: z.number().optional(),
        totalPages: z.number().optional(),
      })
      .passthrough(),
  })
  .passthrough();
