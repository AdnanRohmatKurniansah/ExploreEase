'use client'

import { Button } from '@/app/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/app/components/ui/dialog'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import React, { useState, useEffect } from 'react'
import { Calendar } from '@/app/components/ui/calendar'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { Tours } from '@/app/types/type'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { BookingSchema, SubmitBookingSchema } from '@/app/validations/BookingValidation'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import Spinner from '@/app/components/ui/spinner'
import { useRouter } from 'next/navigation'

type Props = {
  tour: Tours
}

type BookingFormData = z.infer<typeof BookingSchema>
type SubmitBookingFormData = z.infer<typeof SubmitBookingSchema>

const TourSidebar = ({ tour }: Props) => {
  const basePrice = tour.discount_price && tour.discount_price !== 0 ? tour.discount_price : tour.price
  const [total, setTotal] = useState(basePrice)
  const [openDialog, setOpenDialog] = useState(false)
  const router = useRouter()

  const {
    register: registerCheckBooking,
    handleSubmit: checkBooking,
    watch: watchCheck,
    setValue,
    formState: { errors: checkBookingErrors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      selected_date: undefined,
      participants: 1,
    },
  })

  const participants = watchCheck('participants')
  const selected_date = watchCheck('selected_date')

  useEffect(() => {
    setTotal(participants * basePrice)
    setValueSubmit('total_participant', participants)
    setValueSubmit('total_amount', participants * basePrice)
    setValueSubmit('selectedDate', selected_date)
  }, [participants, basePrice, selected_date])

  const {
    register: registerSubmitBooking,
    reset,
    setValue: setValueSubmit,
    handleSubmit: submitBooking,
    formState: { errors: submitBookingErrors },
  } = useForm<SubmitBookingFormData>({
    resolver: zodResolver(SubmitBookingSchema),
    defaultValues: {
      total_amount: total,
      total_participant: participants,
      tourId: tour.id,
      selectedDate: new Date(selected_date)
    }
  })

  const queryClient = useQueryClient()

  const SubmitBooking = useMutation({
    mutationFn: async (data: SubmitBookingFormData) => {
      const response = await axios.post('/api/bookings', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['bookingTransactions'] })
      reset()
      setOpenDialog(false)
      router.push(`/bookings/${data.data.id}`)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to submit')
    }
  })

  return (
    <div className="border rounded-xl bg-white p-4 shadow-md">
      <form onSubmit={checkBooking(() => setOpenDialog(true))}>
        <h2 className="text-lg font-semibold mb-1">Book Your Journey</h2>
        <p className='text-gray-700 text-[15px] mb-5'>Pick Your Perfect Day</p>

        <div className="mb-3">
          <Label className="block text-sm text-gray-700 mb-1">Select a date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" data-empty={!selected_date} className="data-[empty=true]:text-muted-foreground hover:bg-white w-full justify-start text-left font-normal">
                <CalendarIcon className='w-4 me-2' /> {selected_date ? format(selected_date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar disabled={{ before: new Date() }} mode="single" selected={selected_date} onSelect={(date) => setValue('selected_date', date!)} />
            </PopoverContent>
          </Popover>
          {checkBookingErrors.selected_date && (
            <p className="mt-2 text-red-600 text-sm mb-3 pb-0">{checkBookingErrors.selected_date.message}</p>
          )}
        </div>

        <div className="mb-3">
          <Label className="block text-sm text-gray-700 mb-1">Number of participants</Label>
          <Input id="participants" type="number" min={1} {...registerCheckBooking('participants', { valueAsNumber: true })}/>
          {checkBookingErrors.participants && (
              <p className="mt-2 text-red-600 text-sm mb-3 pb-0">{checkBookingErrors.participants.message}</p>
          )}
        </div>

        <div className="mt-4 text-base text-gray-800 font-semibold border-t pt-3">
          Total Price: <span className="text-lg text-primary font-bold">Rp {total.toLocaleString('id-ID')}</span>
        </div>

        <div className="pt-4 w-full">
          <Button type="submit" className="flex items-center w-full gap-2">Book Now</Button>
        </div>
      </form>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <form onSubmit={submitBooking((data) => SubmitBooking.mutate(data))}>
            <DialogHeader>
              <DialogTitle>Confirm Booking</DialogTitle>
              <p className="text-sm text-muted-foreground mb-1">Please confirm your booking and fill in some data below.</p>
            </DialogHeader>

            <div className="py-2 space-y-2">
              <div className="book-data border-2 rounded px-3 pt-3 pb-3">
                <h5 className='text-[15px] font-medium mb-2'>Tour : {tour.title}</h5>
                <h5 className='text-[15px] font-medium mb-2'>Selected Date : {selected_date ? format(selected_date, "PPP") : ''}</h5>
                <h5 className='text-[15px] font-medium'>Total Participants : {participants}</h5>
              </div>
              <div className='pt-3'>
                <Label className='mb-1'>Your Name <span className='text-red-500'>*</span></Label>
                <Input type='text' {...registerSubmitBooking('name')} placeholder="Enter your name" />
                {submitBookingErrors.name && (
                    <p className="mt-2 text-red-600 text-sm mb-3 pb-0">{submitBookingErrors.name.message}</p>
                )}
              </div>
              <div>
                <Label className='mb-1'>Phone Number <span className='text-red-500'>*</span></Label>
                <Input type='text' {...registerSubmitBooking('phone_number')} placeholder="Enter your phone number" />
                {submitBookingErrors.phone_number && (
                    <p className="mt-2 text-red-600 text-sm mb-3 pb-0">{submitBookingErrors.phone_number.message}</p>
                )}
              </div>
              <div>
                <Label className='mb-1'>Email <span className='text-red-500'>*</span></Label>
                <Input type='email' {...registerSubmitBooking('email')} placeholder="Enter your email"/>
                {submitBookingErrors.email && (
                    <p className="mt-2 text-red-600 text-sm mb-3 pb-0">{submitBookingErrors.email.message}</p>
                )}
              </div>
              <div>
                <Label className='mb-1'>Message</Label>
                <Textarea {...registerSubmitBooking('message')} placeholder="Enter your message" />
                {submitBookingErrors.message && (
                    <p className="mt-2 text-red-600 text-sm mb-3 pb-0">{submitBookingErrors.message.message}</p>
                )}
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button disabled={SubmitBooking.isPending} type="submit" className="w-full">
                Submit Booking
                {SubmitBooking.isPending && <span className='ms-2'><Spinner /></span>}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TourSidebar
