'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FieldError, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { DestinationsUpdateSchema } from '@/app/validations/DestinationsValidation'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from '@/app/components/ui/button'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import Spinner from '@/app/components/ui/spinner'
import Image from 'next/image'
import { Destinations } from '@/app/types/type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Textarea } from '@/app/components/ui/textarea'

type DestinationUpdateFormData = z.infer<typeof DestinationsUpdateSchema>

const UpdateForm = ({ destination }: { destination: Destinations }) => {
  const router = useRouter()
  const [imagePreview, setImagePreview] = useState<string | null>(destination.image)

  const { register, control, handleSubmit, formState: {errors} } = useForm<DestinationUpdateFormData>({
    resolver: zodResolver(DestinationsUpdateSchema)
  })

  const queryClient = useQueryClient()

  const UpdateDestination = useMutation({
    mutationFn: async (data: DestinationUpdateFormData) => {
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("image", data.image[0] || '')

        const response = await axios.put(`/api/destinations/${destination.id}`, formData)
        return response.data
    },
    onSuccess: (data) => {
        toast.success(data.message)
        queryClient.invalidateQueries({ queryKey: ['destinations'] }) 
        router.push('/dashboard/destinations')
        router.refresh()
    },
    onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update')
    }
    })

  const changeHandlerImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setImagePreview(file ? URL.createObjectURL(file) : null)
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className='text-lg'>Update destination</CardTitle>
            <CardDescription>Use this form to update destination.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => UpdateDestination.mutate(data))} encType='multipart/form-data' className="space-y-4">
            <div className="space-y-1">
                <Label className='mb-2' htmlFor={'name'}>Name <span className='text-red-500'>*</span></Label>
                <Input defaultValue={destination.name}  {...register('name')} id={'name'} type={'text'} name='name' placeholder="Enter destination's name"/>
            </div>
            {errors.name && (
                <p className="text-red-600 text-sm mb-3 pb-0">{errors.name?.message}</p>
            )}
            <div className="space-y-1">
                <Label className='mb-2' htmlFor={'description'}>Description <span className='text-red-500'>*</span></Label>
                <Textarea
                  defaultValue={destination.description}
                  {...register('description')}
                  id="description"
                  placeholder="Enter destination's description"
                />
            </div>
            {errors.description && (
                <p className="text-red-600 text-sm mb-3 pb-0">{errors.description?.message}</p>
            )}
            {imagePreview && <Image alt='imgPreview' width={'150'} height={'150'} className='py-5' src={imagePreview} />} 
            <div className="space-y-1">
                <Label className='mb-2' htmlFor={'image'}>Icon <span className='text-red-500'>*</span></Label>
                <Input {...register('image', { onChange: changeHandlerImg })} id={'image'} type={'file'} name='image' />
            </div>
            {errors.image && typeof errors.image === 'object' && 'message' in errors.image &&  (
                <p className="text-red-600 text-sm mb-3 pb-0">{(errors.image as FieldError).message}</p>
            )}
            <div className="pt-2 flex justify-end">
                <Button disabled={UpdateDestination.isPending} type="submit" className="flex items-center gap-2">
                    Submit 
                    {UpdateDestination.isPending && <Spinner />}
                </Button>
            </div>
          </form>
        </CardContent>
    </Card>
  )
}

export default UpdateForm