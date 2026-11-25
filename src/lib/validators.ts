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

export const CATEGORIES = ["Electronics", "Fashion", "Home"] as const;

export const productSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be greater than 0"), // in rupees
  image: z.string().url("Enter a valid image URL"),
  category: z.enum(CATEGORIES),
  stock: z.number().int("Stock must be a whole number").min(0, "Stock cannot be negative"),
});

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED"]),
});

export type ProductInput = z.infer<typeof productSchema>;