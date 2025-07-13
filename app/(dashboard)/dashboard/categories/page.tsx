'use client'

import { Button } from '@/app/components/ui/button'
import { PlusCircle } from 'lucide-react'
import React, { useState } from 'react'
import CategoryTable from './category-table'
import Link from 'next/link'

const Page = () => {
  return (
    <div className='main overflow-x-auto'>
      <div className="flex items-center">
        <div className="flex items-center gap-2 mt-4">
          <Link href={'/dashboard/categories/create'}>
            <Button size="sm" className="mb-2">
              <span className="sm:whitespace-nowrap">Add new category</span>
              <PlusCircle className="pl-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
      <CategoryTable />
    </div>
  )
}

export default Page
