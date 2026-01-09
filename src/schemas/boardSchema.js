import { z } from "zod";

export const boardSchema = z.object({
  title: z
    .string()
    .min(1, "Board phải có tiêu đề")
    .max(100, "Tiêu đề không quá 100 ký tự")
    .trim(),
  description: z.string().optional().or(z.literal("")),
  visibility: z.enum(["private", "workspace", "public"]).default("workspace"),
});
