import * as z from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid Username" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
