import { z } from "zod";

export const ContactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    email: z.string().email().min(1, 'Email is required').max(100),
    message: z.string().min(1, 'Message is required').max(255),
})