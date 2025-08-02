'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ToursUpdateSchema } from '@/app/validations/ToursValidation'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from '@/app/components/ui/button'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import Spinner from '@/app/components/ui/spinner'
import Image from 'next/image'
import { Categories, Destinations, Facility, Tours } from '@/app/types/type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group'
import { MultiSelect } from '@/app/components/ui/multi-select'
import QuillEditor from '@/app/components/shared/quill-editor'
import TourImageTable from './tourImage-table'
import TourItineraryTable from './touritinerary-table'

type TourUpdateFormData = z.infer<typeof ToursUpdateSchema>

type UpdateFormProps = {
  tour: Tours,
  categories: Categories[] 
  destinations: Destinations[] 
  includes: Facility[] 
  excludes: Facility[] 
}

const UpdateForm = ({ categories, destinations, excludes, includes, tour }: UpdateFormProps) => {
   const includeList = includes.map((item, index) => ({
    value: item.id,
    label: item.title,
  }))
  const excludeList = excludes.map((item, index) => ({
    value: item.id,
    label: item.title,
  }))

  const router = useRouter()
  const [imagePreview, setImagePreview] = useState<string | null>(tour.image)

  const { register, control, handleSubmit, formState: {errors} } = useForm<TourUpdateFormData>({
    resolver: zodResolver(ToursUpdateSchema),
    defaultValues: {
        categoryId: tour.categoryId,
        destinationId: tour.destinationId,
        is_popular: tour.is_popular == true ? '1' : '2',
        description: tour.description ?? '',
        highlight: tour.highlight ?? '',
        include: tour.include ? JSON.parse(tour.include as any) : [],
        exclude: tour.exclude ? JSON.parse(tour.exclude as any) : [],
    }
  })

  const queryClient = useQueryClient()

  const UpdateTour = useMutation({
    mutationFn: async (data: TourUpdateFormData) => {
        const formData = new FormData()
        formData.append("title", data.title)
        formData.append("description", data.description)
        formData.append("highlight", data.highlight)
        formData.append("price", data.price.toString())
        formData.append("discount_price", data.discount_price.toString())
        formData.append("categoryId", data.categoryId)
        formData.append("destinationId", data.destinationId)
        formData.append("is_popular", data.is_popular.toString())
        formData.append("location", data.location)
        formData.append("include", JSON.stringify(data.include))
        formData.append("exclude", JSON.stringify(data.exclude ?? []))
        formData.append("image", data.image[0] || '')

        const response = await axios.put(`/api/tours/${tour.id}`, formData)
        return response.data
    },
    onSuccess: (data) => {
        toast.success(data.message)
        queryClient.invalidateQueries({ queryKey: ['tours'] }) 
        router.push('/dashboard/tours')
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
    <>
        <Card>
            <CardHeader>
                <CardTitle className='text-lg'>Update tour</CardTitle>
                <CardDescription>Use this form to update tour.</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit((data) => UpdateTour.mutate(data))} encType='multipart/form-data' className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col">
                        <div className="space-y-1 mb-3">
                            <Label className='mb-2' htmlFor={'title'}>Title <span className='text-red-500'>*</span></Label>
                            <Input defaultValue={tour.title} {...register('title')} id={'title'} type={'text'} placeholder="Enter tour's title" />
                        </div>
                        {errors.title && (
                            <p className="text-red-600 text-sm mb-3 pb-0">{errors.title.message}</p>
                        )}
                        <div className="space-y-1 mb-3">
                            <Label className='mb-2' htmlFor={'price'}>Price <span className='text-red-500'>*</span></Label>
                            <Input defaultValue={tour.price} {...register('price')} id={'price'} type={'number'} min={'0'} placeholder="Enter tour's price" />
                        </div>
                        {errors.price && (
                            <p className="text-red-600 text-sm mb-3 pb-0">{errors.price.message}</p>
                        )}
                        <div className="space-y-1 mb-3">
                            <Label className='mb-2' htmlFor={'discount_price'}>Discount Price</Label>
                            <Input defaultValue={tour.discount_price ?? ''} {...register('discount_price')} id={'discount_price'} type={'number'} min={'0'} placeholder="Enter tour's discount's price" />
                        </div>
                        {errors.discount_price && (
                            <p className="text-red-600 text-sm mb-3 pb-0">{errors.discount_price.message}</p>
                        )}
                        <div className="space-y-1 mb-3">
                            <Label className='mb-2' htmlFor={'categoryId'}>Category <span className='text-red-500'>*</span></Label>
                            <Controller
                            name="categoryId"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {categories.map((category: Categories, i: number) => (
                                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                                </Select>
                            )}
                            />
                        </div>
                        {errors.categoryId && (
                            <p className="text-red-600 text-sm mb-3 pb-0">{errors.categoryId.message}</p>
                        )}
                        <div className="space-y-1 mb-3">
                            <Label className='mb-2' htmlFor={'destinationId'}>Destination <span className='text-red-500'>*</span></Label>
                            <Controller
                            name="destinationId"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a destination" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {destinations.map((destination: Destinations, i: number) => (
                                            <SelectItem key={destination.id} value={destination.id}>{destination.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                                </Select>
                            )}
                            />
                        </div>
                        {errors.destinationId && (
                            <p className="text-red-600 text-sm mb-3 pb-0">{errors.destinationId.message}</p>
                        )}
                        <div className="space-y-1 mb-3">
                            <Label className='mb-3' htmlFor="is_popular">Popular <span className='text-red-500'>*</span></Label>
                            <Controller
                                name="is_popular"
                                control={control}
                                render={({ field }) => (
                                <RadioGroup
                                    className="flex gap-6"
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="1" id="is_popular_yes" />
                                    <Label htmlFor="is_popular_yes">Yes</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="2" id="is_popular_no" />
                                    <Label htmlFor="is_popular_no">No</Label>
                                    </div>
                                </RadioGroup>
                                )}
                            />
                        </div>
                        {errors.is_popular && (
                            <p className="text-red-600 text-sm mb-3 pb-0">{errors.is_popular.message}</p>
                        )}
                        <div className="space-y-1 mb-3">
                            <Label className='mb-2' htmlFor={'location'}>Location <span className='text-red-500'>*</span></Label>
                            <Input defaultValue={tour.location} {...register('location')} id={'location'} type={'text'} placeholder="Enter tour's location" />
                        </div>
                        {errors.location && (
                            <p className="text-red-600 text-sm mb-3 pb-0">{errors.location.message}</p>
                        )}
                    </div>
                    <div className="col">
                        <div className="space-y-1 mb-3">
                            <Label className='mb-2' htmlFor={'include'}>Include <span className='text-red-500'>*</span></Label>
                            <Controller
                                control={control}
                                name="include"
                                render={({ field }) => (
                                    <MultiSelect
                                    options={includeList}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    placeholder="Select facility include"
                                    variant="inverted"
                                    animation={0}
                                    />
                                )}
                            />
                        </div>
                        {errors.include && (
                            <p className="text-red-600 text-sm mb-3 pb-0">{errors.include.message}</p>
                        )}
                        <div className="space-y-1 mb-3">
                            <Label className='mb-2' htmlFor={'exclude'}>Exclude </Label>
                            <Controller
                                control={control}
                                name="exclude"
                                render={({ field }) => (
                                    <MultiSelect
                                    options={excludeList}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    placeholder="Select facility exclude"
                                    variant="inverted"
                                    animation={0}
                                    />
                                )}
                            />
                        </div>
                        {errors.exclude && (
                            <p className="text-red-600 text-sm mb-3 pb-0">{errors.exclude.message}</p>
                        )}
                        <div className="space-y-1 mb-3">
                            <Label className="mb-2" htmlFor="description">Description <span className="text-red-500">*</span></Label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <QuillEditor
                                        id="description-editor"
                                        value={tour.description}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.description && (
                                <p className="text-red-600 text-sm mb-3 pb-0">{errors.description.message}</p>
                            )}
                        </div>
                        <div className="space-y-1 mb-3">
                            <Label className="mb-2" htmlFor="highlight">Highlight <span className="text-red-500">*</span></Label>
                            <Controller
                                name="highlight"
                                control={control}
                                render={({ field }) => (
                                    <QuillEditor
                                        id="highlight-editor"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        {errors.highlight && (
                            <p className="text-red-600 text-sm mb-3 pb-0">{errors.highlight.message}</p>
                        )}
                        </div>
                        {imagePreview && <Image alt='imgPreview' width={150} height={150} className='py-5' src={imagePreview} />}
                        <div className="space-y-1">
                            <Label className='mb-2' htmlFor={'image'}>Image</Label>
                            <Input {...register('image', { onChange: changeHandlerImg })} id={'image'} type={'file'} />
                        </div>
                        {errors.image && typeof errors.image === 'object' && 'message' in errors.image && (
                            <p className="text-red-600 text-sm mb-3 pb-0">{(errors.image as FieldError).message}</p>
                        )}
                    </div>
                </div>
                <div className="pt-2 flex justify-end">
                    <Button disabled={UpdateTour.isPending} type="submit" className="flex items-center gap-2">
                        Submit 
                        {UpdateTour.isPending && <Spinner />}
                    </Button>
                </div>
            </form>
            </CardContent>
        </Card>


        <TourImageTable tourId={tour.id} />
        <TourItineraryTable tourId={tour.id} />
    </>
  )
}

export default UpdateForm