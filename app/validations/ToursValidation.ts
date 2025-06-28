import { z } from "zod";

export const ToursSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().min(1, 'Description is required'),
    highlight: z.string().min(1, 'Highlight is required'),
    price: z.coerce.number().min(1, 'Price is required'),
    discount_price: z.coerce.number(),
    categoryId: z.string().min(1, 'CategoryId is required'),
    destinationId: z.string().min(1, 'DestinationId is required'),
    is_popular: z.string(),
    location: z.string().min(1, 'Location is required'),
    include: z.array(z.string()).min(1, 'At least one include is required'),
    exclude: z.array(z.string()).optional(),
    image: z.any().refine((files) => files?.length != 0, "Image is required.") 
})

export const ToursUpdateSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().min(1, 'Description is required'),
    highlight: z.string().min(1, 'Highlight is required'),
    price: z.coerce.number().min(1, 'Price is required'),
    discount_price: z.coerce.number(),
    categoryId: z.string().min(1, 'CategoryId is required'),
    destinationId: z.string().min(1, 'DestinationId is required'),
    is_popular: z.string(),
    location: z.string().min(1, 'Location is required'),
    include: z.array(z.string()).min(1, 'At least one include is required'),
    exclude: z.array(z.string()).optional(),
    image: z.any().nullable() 
})

export const ToursImageSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    tourId: z.string().min(1, 'TourId is required'),
    image: z.any().refine((files) => files?.length != 0, "Image is required.") 
})

export const ToursImageUpdateSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    image: z.any().nullable() 
})

export const ToursItinerarySchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    tourId: z.string().min(1, 'TourId is required'),
    description: z.string().min(1, 'Description is required').max(255),
})

export const ToursItineraryUpdateSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().min(1, 'Description is required').max(255),
})