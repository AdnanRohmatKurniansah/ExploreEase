'use client'

import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { LoginSchema } from '@/app/validations/AuthValidation'
import { Label } from '@radix-ui/react-dropdown-menu'
import React, { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver  } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import Spinner from '@/app/components/ui/spinner'

type CredentialsLogin = z.infer<typeof LoginSchema>

const Page = () => {
  const { register, handleSubmit, formState: {errors}} = useForm<CredentialsLogin>({
    resolver: zodResolver(LoginSchema)
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const LoginHandle = async (data: CredentialsLogin) => {
    setIsSubmitting(true)

    const response = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false
    })

    if (response?.error) {
      setIsSubmitting(false)
      toast.error('Invalid credentials')
    } else {
      setIsSubmitting(false)
      toast.success('Login successfully')
      router.push('/dashboard')
    }
  }


  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form onSubmit={handleSubmit(LoginHandle)} className="p-6 md:p-8">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome</h1>
                    <p className="text-muted-foreground text-balance">
                      Login to ExploreEase Admin Dashboard
                    </p>
                  </div>
                  <div className="grid gap-3">
                    <Label>Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder='Enter your username'
                      {...register('username')}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-600 text-sm mb-0 pb-0">{errors.username?.message}</p>
                  )}
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label>Password</Label>
                    </div>
                    <Input id="password" {...register('password')} placeholder='Enter your password' type="password"  />
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-sm mb-0 pb-0">{errors.password?.message}</p>
                  )}
                  <Button disabled={isSubmitting} type="submit" className="w-full">
                    Login
                    <span className='ml-2'>
                      {isSubmitting && <Spinner />}
                    </span>
                  </Button>
                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                    </span>
                  </div>
                </div>
              </form>
              <div className="bg-muted relative hidden md:block">
                <img
                  src="/images/authimg.png"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Page