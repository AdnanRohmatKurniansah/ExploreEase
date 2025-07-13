'use client'

import React from 'react'
import BookingsTable from './bookings-table'

const Page = () => {
  return (
    <div className='main overflow-x-auto'>
      <div className="flex items-center">
        <div className="flex items-center gap-2 mt-4">
        </div>
      </div>
      <BookingsTable />
    </div>
  )
}

export default Page
