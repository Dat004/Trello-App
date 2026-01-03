import { z } from "zod";

const infoSchema = z.object({
  full_name: z.string().trim().min(1, "Vui lòng nhập đầy đủ họ tên"),
  bio: z.string().trim().optional().or(z.literal("")),
});

export { infoSchema };
