import z from "zod";

export const generateWebsiteSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100),
  businessType: z
    .string()
    .min(2, "Business type must be at least 2 characters")
    .max(100),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500),
});

export const createWebsiteSchema = z.object({
  businessName: z.string().min(2).max(100),
  businessType: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  title: z.string().min(2).max(200),
  tagline: z.string().min(2).max(200),
  about: z.string().min(10).max(1000),
  services: z.array(z.string()).min(1, "At least one service is required"),
});

export const updateWebsiteSchema = z
  .object({
    businessName: z.string().min(2).max(100).optional(),
    businessType: z.string().min(2).max(100).optional(),
    description: z.string().min(10).max(500).optional(),
    title: z.string().min(2).max(200).optional(),
    tagline: z.string().min(2).max(200).optional(),
    about: z.string().min(10).max(1000).optional(),
    services: z.array(z.string()).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
