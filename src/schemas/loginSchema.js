import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ").toLowerCase(),
  password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
});

export default loginSchema;
