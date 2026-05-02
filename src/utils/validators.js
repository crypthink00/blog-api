import { z } from "zod";

//Schema for User registration

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(3, "Name is too short").max(50, "Name is too long"),
  role: z
    .enum(["USER", "EDITOR", "ADMIN"], {
      error: () => "Role must be USER, EDITOR, or ADMIN",
    })
    .default("USER"),
});

//Schema for User login

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(50, "Password is too long"),
});

//Schema for Post creation
export const postSchema = z.object({
  title: z.string().min(5, "Title is too short").max(200, "Title is too long"),
  content: z.string().min(10, "Content is too short"),
  published: z.boolean().optional().default(false),
});

//Schema for Post update
export const postUpdateSchema = z.object({
  title: z
    .string()
    .min(5, "Title is too short")
    .max(200, "Title is too long")
    .optional(),
  content: z.string().min(10, "Content is too short").optional(),
  published: z.boolean().optional(),
});
