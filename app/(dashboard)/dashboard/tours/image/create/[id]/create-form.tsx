'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import React, { useState } from 'react'
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
import Image from 'next/image'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ToursImageSchema } from '@/app/validations/ToursValidation'

type TourImageFormData = z.infer<typeof ToursImageSchema>

const CreateForm = ({ tourId }: {tourId: string}) => {
  const router = useRouter()
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<TourImageFormData>({
    resolver: zodResolver(ToursImageSchema),
    defaultValues: {
      tourId
    }
  })

  const queryClient = useQueryClient()

  const AddTourImage = useMutation({
    mutationFn: async (data: TourImageFormData) => {
      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("tourId", data.tourId)
      formData.append("image", data.image[0] || '')

      const response = await axios.post('/api/tours/image', formData)
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['toursImage'] })
      router.push(`/dashboard/tours/update/${tourId}`)
      router.refresh()
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to add')
    }
  })

  const changeHandlerImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setImagePreview(file ? URL.createObjectURL(file) : null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Add new tour's image</CardTitle>
        <CardDescription>Use this form to add a new tour's image to the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((data) => AddTourImage.mutate(data))} encType='multipart/form-data' className="space-y-4">
          <div className="space-y-1">
            <Label className='mb-2' htmlFor={'title'}>Title <span className='text-red-500'>*</span></Label>
            <Input {...register('title')} id={'title'} type={'text'} placeholder="Enter tour's image title" />
          </div>
          {errors.title && (
            <p className="text-red-600 text-sm mb-3 pb-0">{errors.title.message}</p>
          )}
          {imagePreview && <Image alt='imgPreview' width={150} height={150} className='py-5' src={imagePreview} />}
          <div className="space-y-1">
            <Label className='mb-2' htmlFor={'image'}>Image <span className='text-red-500'>*</span></Label>
            <Input {...register('image', { onChange: changeHandlerImg })} id={'image'} type={'file'} />
          </div>
          {errors.image && typeof errors.image === 'object' && 'message' in errors.image && (
            <p className="text-red-600 text-sm mb-3 pb-0">{(errors.image as FieldError).message}</p>
          )}
          <div className="pt-2 flex justify-end">
            <Button disabled={AddTourImage.isPending} type="submit" className="flex items-center gap-2">
              Submit
              {AddTourImage.isPending && <Spinner />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateForm
