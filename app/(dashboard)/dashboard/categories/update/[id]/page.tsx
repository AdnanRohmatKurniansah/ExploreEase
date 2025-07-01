import { Button } from '@/app/components/ui/button'
import { ArrowLeftCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import UpdateForm from './update-form'
import { notFound } from 'next/navigation'
import prisma from '@/app/lib/prisma'

type Params = {
  params: Promise<{
    id: string
  }>
}

const Page = async ({ params }: Params) => {
  const { id } = await params
  const category = await prisma.categories.findUnique({
    where: {
        id: id
    }
  })

  if (!category) {
    notFound()
  }

  return (
    <div className='main'>
      <div className="flex items-center">
        <div className="flex items-center gap-2 mt-4">
          <Link href={'/dashboard/categories'}>
            <Button size="sm" className="gap-1 mb-2">
              <ArrowLeftCircle className="h-3.5 w-3.5" />
              <span className="sm:whitespace-nowrap">Back to list page</span>
            </Button>
          </Link>
        </div>
      </div>
      <UpdateForm category={category} />
    </div>
  )
}

export default Page