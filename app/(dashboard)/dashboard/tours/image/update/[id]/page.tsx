import { Button } from '@/app/components/ui/button'
import { ArrowLeftCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { notFound } from 'next/navigation'
import prisma from '@/app/lib/prisma'
import UpdateForm from './update-form'

interface Params {
  params: Promise<{
    id: string
  }>
}

const Page = async ({ params }: Params) => {
  const { id } = await params

  const tourImage = await prisma.toursImage.findUnique({
    where: {
        id: id
    }
  })

  if (!tourImage) {
    notFound()
  }

  return (
    <div className='main'>
      <div className="flex items-center">
        <div className="flex items-center gap-2 mt-4">
          <Link href={`/dashboard/tours/update/${tourImage.tourId}`}>
            <Button size="sm" className="gap-1 mb-2">
              <ArrowLeftCircle className="h-3.5 w-3.5" />
              <span className="sm:whitespace-nowrap">Back to list page</span>
            </Button>
          </Link>
        </div>
      </div>
      <UpdateForm tourImage={tourImage} />
    </div>
  )
}

export default Page