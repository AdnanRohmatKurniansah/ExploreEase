import { Button } from '@/app/components/ui/button'
import { ArrowLeftCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import CreateForm from './create-form'

const Page = () => {
  return (
    <div className='main'>
      <div className="flex items-center">
        <div className="flex items-center gap-2 mt-4">
          <Link href={'/dashboard/destinations'}>
            <Button size="sm" className="gap-1 mb-2">
              <ArrowLeftCircle className="h-3.5 w-3.5" />
              <span className="sm:whitespace-nowrap">Back to list page</span>
            </Button>
          </Link>
        </div>
      </div>
      <CreateForm />
    </div>
  )
}

export default Page