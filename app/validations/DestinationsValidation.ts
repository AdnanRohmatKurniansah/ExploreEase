import { z } from "zod";

export const DestinationsSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().min(1, 'Description is required').max(255),
    image: z.any().refine((files) => files?.length != 0, "Image is required.") 
})

export const DestinationsUpdateSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().min(1, 'Description is required').max(255),
    image: z.any().nullable() 
})