import { z } from "zod";

export const inviteSchema = z.object({
  emails: z
    .array(z.string().email("Email không hợp lệ"))
    .min(1, "Vui lòng thêm ít nhất một email"),
  role: z.string(),
  message: z.string().optional(),
});
