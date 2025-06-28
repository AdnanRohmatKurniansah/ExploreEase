import { z } from "zod";

export const FacilitySchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    type: z.string().min(1, 'Type is required').max(255),
})

export const FacilityUpdateSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    type: z.string().min(1, 'Type is required').max(255),
})