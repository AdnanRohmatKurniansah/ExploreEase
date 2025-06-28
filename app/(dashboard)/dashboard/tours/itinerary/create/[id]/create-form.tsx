'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import React from 'react'
import { useRouter } from 'next/navigation'
import { FieldError, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from '@/app/components/ui/button'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import Spinner from '@/app/components/ui/spinner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ToursItinerarySchema } from '@/app/validations/ToursValidation'
import { Textarea } from '@/app/components/ui/textarea'

type TourItineraryFormData = z.infer<typeof ToursItinerarySchema>

const CreateForm = ({ tourId }: {tourId: string}) => {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<TourItineraryFormData>({
    resolver: zodResolver(ToursItinerarySchema),
    defaultValues: {
      tourId
    }
  })

  const queryClient = useQueryClient()

  const AddTourItinerary = useMutation({
    mutationFn: async (data: TourItineraryFormData) => {
      const response = await axios.post('/api/tours/itinerary', data, {
        headers: {
            'Content-Type': 'application/json'
        }
      })
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['toursItinerary'] })
      router.push(`/dashboard/tours/update/${tourId}`)
      router.refresh()
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to add')
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Add new tour's itinerary</CardTitle>
        <CardDescription>Use this form to add a new tour's itinerary to the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((data) => AddTourItinerary.mutate(data))} className="space-y-4">
          <div className="space-y-1">
            <Label className='mb-2' htmlFor={'title'}>Title <span className='text-red-500'>*</span></Label>
            <Input {...register('title')} id={'title'} type={'text'} placeholder="Enter tour's itinerary title" />
          </div>
          {errors.title && (
            <p className="text-red-600 text-sm mb-3 pb-0">{errors.title.message}</p>
          )}
          <div className="space-y-1">
            <Label className='mb-2' htmlFor={'description'}>Description <span className='text-red-500'>*</span></Label>
            <Textarea
              {...register('description')}
              id="description"
              placeholder="Enter tour's itinerary description"
            />
          </div>
          {errors.description && (
            <p className="text-red-600 text-sm mb-3 pb-0">{errors.description.message}</p>
          )}
          <div className="pt-2 flex justify-end">
            <Button disabled={AddTourItinerary.isPending} type="submit" className="flex items-center gap-2">
              Submit
              {AddTourItinerary.isPending && <Spinner />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateForm
