import { z } from "zod";

export const CategoriesSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().min(1, 'Description is required').max(255),
    icon: z.any().refine((files) => files?.length != 0, "Image is required.") 
})

export const CategoriesUpdateSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().min(1, 'Description is required').max(255),
    icon: z.any().nullable() 
})