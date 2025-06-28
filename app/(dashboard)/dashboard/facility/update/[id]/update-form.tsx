'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FacilityUpdateSchema } from '@/app/validations/FacilityValidation'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from '@/app/components/ui/button'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import Spinner from '@/app/components/ui/spinner'
import { Facility } from '@/app/types/type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'

type FacilityUpdateFormData = z.infer<typeof FacilityUpdateSchema>

const UpdateForm = ({ facility }: { facility: Facility }) => {
  const router = useRouter()

  const { register, control, handleSubmit, formState: {errors} } = useForm<FacilityUpdateFormData>({
    resolver: zodResolver(FacilityUpdateSchema),
    defaultValues: {
        type: facility.type
    }
  })

  const queryClient = useQueryClient()

  const UpdateFacility = useMutation({
    mutationFn: async (data: FacilityUpdateFormData) => {
        const response = await axios.put(`/api/facility/${facility.id}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    },
    onSuccess: (data) => {
        toast.success(data.message)
        queryClient.invalidateQueries({ queryKey: ['facility'] }) 
        router.push('/dashboard/facility')
        router.refresh()
    },
    onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update')
    }
    })


  return (
    <Card>
        <CardHeader>
            <CardTitle className='text-lg'>Update facility</CardTitle>
            <CardDescription>Use this form to update facility.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => UpdateFacility.mutate(data))} className="space-y-4">
            <div className="space-y-1">
                <Label className='mb-2' htmlFor={'name'}>Name <span className='text-red-500'>*</span></Label>
                <Input defaultValue={facility.title}  {...register('title')} id={'title'} type={'text'} placeholder="Enter facility's title"/>
            </div>
            {errors.title && (
                <p className="text-red-600 text-sm mb-3 pb-0">{errors.title?.message}</p>
            )}
            <div className="space-y-1">
                <Label className='mb-2' htmlFor={'type'}>Type <span className='text-red-500'>*</span></Label>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Select defaultValue={facility.type} value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full md:w-1/2">
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="include">Include</SelectItem>
                                    <SelectItem value="exclude">Exclude</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                 />
            </div>
            {errors.type && (
                <p className="text-red-600 text-sm mb-3 pb-0">{errors.type.message}</p>
            )}
            <div className="pt-2 flex justify-end">
                <Button disabled={UpdateFacility.isPending} type="submit" className="flex items-center gap-2">
                    Submit 
                    {UpdateFacility.isPending && <Spinner />}
                </Button>
            </div>
          </form>
        </CardContent>
    </Card>
  )
}

export default UpdateForm