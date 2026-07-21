import { z } from "zod";

const strongPassword = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .max(128, "Mật khẩu không quá 128 ký tự")
  .regex(/[a-z]/, "Mật khẩu phải có chữ thường")
  .regex(/[A-Z]/, "Mật khẩu phải có chữ hoa")
  .regex(/\d/, "Mật khẩu phải có chữ số");

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ").toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: strongPassword,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    password: strongPassword,
    confirmPassword: strongPassword,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
