import { Button } from '@/app/components/ui/button'
import { ArrowLeftCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import CreateForm from './create-form'
import prisma from '@/app/lib/prisma'

const Page = async () => {
  const categories = await prisma.categories.findMany({
      orderBy: {
        name: "asc",
      },
  })
  const destinations = await prisma.destinations.findMany({
      orderBy: {
        name: "asc",
      },
  })
  const includes = await prisma.facility.findMany({
    where: {
      type: "include"
    },
    orderBy: {
      title: "asc",
    },
  })
  const excludes = await prisma.facility.findMany({
    where: {
      type: "exclude"
    },
    orderBy: {
      title: "asc",
    },
  })

  return (
    <div className='main'>
      <div className="flex items-center">
        <div className="flex items-center gap-2 mt-4">
          <Link href={'/dashboard/tours'}>
            <Button size="sm" className="gap-1 mb-2">
              <ArrowLeftCircle className="h-3.5 w-3.5" />
              <span className="sm:whitespace-nowrap">Back to list page</span>
            </Button>
          </Link>
        </div>
      </div>
      <CreateForm categories={categories} destinations={destinations} includes={includes} excludes={excludes} />
    </div>
  )
}

export default Page