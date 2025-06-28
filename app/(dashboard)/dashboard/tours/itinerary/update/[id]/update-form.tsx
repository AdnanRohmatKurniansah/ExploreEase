'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FieldError, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ToursItineraryUpdateSchema } from '@/app/validations/ToursValidation'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from '@/app/components/ui/button'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import Spinner from '@/app/components/ui/spinner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Textarea } from '@/app/components/ui/textarea'
import { ToursItinerary } from '@prisma/client'

type TourItineraryUpdateFormData = z.infer<typeof ToursItineraryUpdateSchema>

const UpdateForm = ({ tourItinerary }: { tourItinerary: ToursItinerary}) => {
  const router = useRouter()

  const { register, control, handleSubmit, formState: {errors} } = useForm<TourItineraryUpdateFormData>({
    resolver: zodResolver(ToursItineraryUpdateSchema)
  })

  const queryClient = useQueryClient()

  const UpdateTourItinerary = useMutation({
    mutationFn: async (data: TourItineraryUpdateFormData) => {
        const response = await axios.put(`/api/tours/itinerary/${tourItinerary.id}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    },
    onSuccess: (data) => {
        toast.success(data.message)
        queryClient.invalidateQueries({ queryKey: ['toursItinerary'] }) 
        router.push(`/dashboard/tours/update/${tourItinerary.tourId}`)
        router.refresh()
    },
    onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update')
    }
  })

  return (
    <Card>
        <CardHeader>
            <CardTitle className='text-lg'>Update tour image</CardTitle>
            <CardDescription>Use this form to update tour image.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => UpdateTourItinerary.mutate(data))}  className="space-y-4">
            <div className="space-y-1">
                <Label className='mb-2' htmlFor={'title'}>Title <span className='text-red-500'>*</span></Label>
                <Input defaultValue={tourItinerary.title}  {...register('title')} id={'title'} type={'text'}  placeholder="Enter tour's image title"/>
            </div>
            {errors.title && (
                <p className="text-red-600 text-sm mb-3 pb-0">{errors.title?.message}</p>
            )}
            <div className="space-y-1">
                <Label className='mb-2' htmlFor={'description'}>Description <span className='text-red-500'>*</span></Label>
                <Textarea
                    defaultValue={tourItinerary.description}
                    {...register('description')}
                    id="description"
                    placeholder="Enter tour's itinerary description"
                />
            </div>
            {errors.description && (
                <p className="text-red-600 text-sm mb-3 pb-0">{errors.description.message}</p>
            )}
            <div className="pt-2 flex justify-end">
                <Button disabled={UpdateTourItinerary.isPending} type="submit" className="flex items-center gap-2">
                    Submit 
                    {UpdateTourItinerary.isPending && <Spinner />}
                </Button>
            </div>
          </form>
        </CardContent>
    </Card>
  )
}

export default UpdateForm