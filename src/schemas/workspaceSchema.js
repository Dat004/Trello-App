import { z } from "zod";

export const workspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên workspace không được để trống")
    .max(100, "Tên không quá 100 ký tự"),
  description: z.string().trim().optional().or(z.literal("")),
  max_members: z.coerce
    .number()
    .int()
    .min(5, "Giới hạn thành viên tối thiểu là 5")
    .max(50, "Giới hạn thành viên tối đa là 50")
    .default(10),
});
