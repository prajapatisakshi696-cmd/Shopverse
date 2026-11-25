import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10 digit mobile number"),
  address: z.string().min(5, "Enter your address"),
  city: z.string().min(2, "Enter your city"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6 digit pincode"),
});

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        quantity: z.number().int().min(1).max(10),
      })
    )
    .min(1, "Cart is empty"),
  shipping: checkoutSchema,
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type OrderInput = z.infer<typeof orderSchema>;