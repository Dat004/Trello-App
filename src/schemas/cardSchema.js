import { z } from "zod";

export const cardSchema = z.object({
  title: z
    .string()
    .min(1, "Card phải có tiêu đề")
    .max(100, "Tiêu đề không quá 100 ký tự")
    .trim(),
  description: z.string().optional().or(z.literal("")),
  due_date: z.date().optional().nullable(),
  priority: z.enum(["low", "medium", "high"]).default("medium").optional(),
});
