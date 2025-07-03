import { Button } from '@/app/components/ui/button'
import { ArrowLeftCircle, Mail, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { notFound } from 'next/navigation'
import prisma from '@/app/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'

interface Params {
  params: Promise<{
    id: string
  }>
}

const Page = async ({ params }: Params) => {
  const { id } = await params

  const contact = await prisma.contact.findUnique({
    where: {
        id: id
    }
  })

  if (!contact) {
    notFound()
  }

  return (
    <div className='main'>
      <div className="flex items-center">
        <div className="flex items-center gap-2 mt-4">
          <Link href={'/dashboard/contact'}>
            <Button size="sm" className="gap-1 mb-2">
              <ArrowLeftCircle className="h-3.5 w-3.5" />
              <span className="sm:whitespace-nowrap">Back to list page</span>
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle className='text-lg'>Detail contact</CardTitle>
            <CardDescription>See contact details sent from user.</CardDescription>
        </CardHeader>
        <CardContent>
            <ul className='why-choose-us mb-8'>
                <li className='flex mb-4'>
                    <div className="icon me-3 bg-primary rounded-full p-2 w-10 h-10 flex items-center justify-center flex-shrink-0">
                        <User className="text-white w-4 h-4" />
                    </div>
                    <div className="text">
                        <h3 className='font-semibold'>Name:</h3>
                        <p>{contact.name}</p>
                    </div>
                </li>
                <li className='flex mb-4'>
                    <div className="icon me-3 bg-primary rounded-full p-2 w-10 h-10 flex items-center justify-center flex-shrink-0">
                        <Mail className="text-white w-4 h-4" />
                    </div>
                    <div className="text">
                        <h3 className='font-semibold'>Email:</h3>
                        <p>{contact.email}</p>
                    </div>
                </li>
                <li className='flex mb-4'>
                    <div className="icon me-3 bg-primary rounded-full p-2 w-10 h-10 flex items-center justify-center flex-shrink-0">
                        <Mail className="text-white w-4 h-4" />
                    </div>
                    <div className="text">
                        <h3 className='font-semibold'>Message:</h3>
                        <p>{contact.message}</p>
                    </div>
                </li>
            </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page