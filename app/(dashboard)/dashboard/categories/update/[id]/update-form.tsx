'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FieldError, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CategoriesUpdateSchema } from '@/app/validations/CategoriesValidation'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from '@/app/components/ui/button'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import Spinner from '@/app/components/ui/spinner'
import Image from 'next/image'
import { Categories } from '@/app/types/type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Textarea } from '@/app/components/ui/textarea'

type CategoryUpdateFormData = z.infer<typeof CategoriesUpdateSchema>

const UpdateForm = ({ category }: { category: Categories }) => {
  const router = useRouter()
  const [imagePreview, setImagePreview] = useState<string | null>(category.icon)

  const { register, control, handleSubmit, formState: {errors} } = useForm<CategoryUpdateFormData>({
    resolver: zodResolver(CategoriesUpdateSchema)
  })

  const queryClient = useQueryClient()

  const UpdateCategory = useMutation({
    mutationFn: async (data: CategoryUpdateFormData) => {
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("icon", data.icon[0] || '')

        const response = await axios.put(`/api/categories/${category.id}`, formData)
        return response.data
    },
    onSuccess: (data) => {
        toast.success(data.message)
        queryClient.invalidateQueries({ queryKey: ['categories'] }) 
        router.push('/dashboard/categories')
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
            <CardTitle className='text-lg'>Update category</CardTitle>
            <CardDescription>Use this form to update category.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => UpdateCategory.mutate(data))} encType='multipart/form-data' className="space-y-4">
            <div className="space-y-1">
                <Label className='mb-2' htmlFor={'name'}>Name <span className='text-red-500'>*</span></Label>
                <Input defaultValue={category.name}  {...register('name')} id={'name'} type={'text'} name='name' placeholder="Enter category's name"/>
            </div>
            {errors.name && (
                <p className="text-red-600 text-sm mb-3 pb-0">{errors.name?.message}</p>
            )}
            <div className="space-y-1">
                <Label className='mb-2' htmlFor={'description'}>Description <span className='text-red-500'>*</span></Label>
                <Textarea
                  defaultValue={category.description}
                  {...register('description')}
                  id="description"
                  placeholder="Enter category's description"
                />
            </div>
            {errors.description && (
                <p className="text-red-600 text-sm mb-3 pb-0">{errors.description?.message}</p>
            )}
            {imagePreview && <Image alt='imgPreview' width={'150'} height={'150'} className='py-5' src={imagePreview} />} 
            <div className="space-y-1">
                <Label className='mb-2' htmlFor={'icon'}>Icon <span className='text-red-500'>*</span></Label>
                <Input {...register('icon', { onChange: changeHandlerImg })} id={'icon'} type={'file'} name='icon' />
            </div>
            {errors.icon && typeof errors.icon === 'object' && 'message' in errors.icon &&  (
                <p className="text-red-600 text-sm mb-3 pb-0">{(errors.icon as FieldError).message}</p>
            )}
            <div className="pt-2 flex justify-end">
                <Button disabled={UpdateCategory.isPending} type="submit" className="flex items-center gap-2">
                    Submit 
                    {UpdateCategory.isPending && <Spinner />}
                </Button>
            </div>
          </form>
        </CardContent>
    </Card>
  )
}

export default UpdateForm