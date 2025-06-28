import { Button } from '@/app/components/ui/button'
import { ArrowLeftCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import CreateForm from './create-form'

interface Params {
  params: {
    id: string
  }
}

const Page = ({ params }: Params) => {
  return (
    <div className='main'>
      <div className="flex items-center">
        <div className="flex items-center gap-2 mt-4">
          <Link href={`/dashboard/tours/update/${params.id}`}>
            <Button size="sm" className="gap-1 mb-2">
              <ArrowLeftCircle className="h-3.5 w-3.5" />
              <span className="sm:whitespace-nowrap">Back to update page</span>
            </Button>
          </Link>
        </div>
      </div>
      <CreateForm tourId={params.id} />
    </div>
  )
}

export default Page