'use client'

import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import Spinner from '@/app/components/ui/spinner'
import { Textarea } from '@/app/components/ui/textarea'
import { ContactSchema } from '@/app/validations/ContactValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type ContactFormData = z.infer<typeof ContactSchema>

const ContactForm = () => {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors }, control } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema)
  })

  const queryClient = useQueryClient()

  const AddContact = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await axios.post('/api/contact', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['contact'] })
      router.push('/contact')
      router.refresh()
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to send')
    }
  })

  return (
    <div className="contact-form bg-white p-6 rounded-xl border shadow">
        <h3 className="text-xl font-bold mb-4">Send Us a Message</h3>
        <form onSubmit={handleSubmit((data) => AddContact.mutate(data))} className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Name</Label>
              <Input {...register('name')} type="text" id="name" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-primary" required />
            </div>
            {errors.name && (
              <p className="text-red-600 text-sm mb-3 pb-0">{errors.name.message}</p>
            )}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</Label>
              <Input {...register('email')} type="email" id="email" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-primary" required />
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm mb-3 pb-0">{errors.email.message}</p>
            )}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">Message</Label>
              <Textarea {...register('message')} id="message" name="message" className="w-full h-[100px] px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-primary" required />
            </div>
            {errors.message && (
              <p className="text-red-600 text-sm mb-3 pb-0">{errors.message.message}</p>
            )}
            <Button
              disabled={AddContact.isPending}
              type="submit"
              className="bg-primary flex gap-2 text-white px-6 py-2 rounded-md hover:bg-primary/90 transition"
            >
              Send Message
              {AddContact.isPending && <Spinner />}
            </Button>
        </form>
    </div>
  )
}

export default ContactForm