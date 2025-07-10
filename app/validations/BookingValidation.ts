import { z } from "zod"

export const BookingSchema = z.object({
  selected_date: z.date({
    required_error: 'Selected date is required',
    invalid_type_error: 'Invalid date format'
  }),
  participants: z.number().min(1, 'Participants is required'),
})

export const SubmitBookingSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    phone_number: z.string().min(1, 'Phone Number is required').max(30),
    email: z.string().email().min(1, 'Email is required'),
    total_amount: z.number().min(1, 'Total Amount is required'),
    total_participant: z.number().min(1, 'Total Participants is required'),
    tourId: z.string().min(1, 'TourId is required'),
    selectedDate: z.date({
        required_error: 'Selected date is required',
        invalid_type_error: 'Invalid date format'
    }),
    message: z.string().max(255)
})