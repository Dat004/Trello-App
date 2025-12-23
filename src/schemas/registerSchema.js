import { z } from "zod";

const registerSchema = z
  .object({
    full_name: z.string().min(1, "Họ và tên là bắt buộc").trim(),
    email: z.string().trim().email("Email không hợp lệ").toLowerCase(),
    password: z.string().trim().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
    confirmPassword: z.string().trim().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu chưa khớp. Vui lòng thử lại",
    path: ["confirmPassword"],
  });

export default registerSchema;
