'use client'

import { Button } from '@/app/components/ui/button'
import { PlusCircle } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import DestinationTable from './destination-table'

const Page = () => {
  return (
    <div className='main'>
      <div className="flex items-center">
        <div className="flex items-center gap-2 mt-4">
          <Link href={'/dashboard/destinations/create'}>
            <Button size="sm" className="mb-2">
              <span className="sm:whitespace-nowrap">Add new destination</span>
              <PlusCircle className="pl-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
      <DestinationTable />
    </div>
  )
}

export default Page
