'use client'

import React from 'react'
import { CheckCircle } from 'lucide-react'
import { BookingTransactions } from '@/app/types/type'
import Link from 'next/link'

type Props = {
  booking: BookingTransactions
}

const ThankYouClient = ({ booking }: Props) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e6f8eb] via-[#eafbee] to-[#f4fdf6] px-4">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full px-8 py-10 text-center relative">
        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-green-500 shadow-md">
          <CheckCircle className="text-white w-10 h-10" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Payment Successful 🎉</h1>
        <p className="text-gray-600 mb-6 text-sm">
          Your payment has been successfully processed. Thank you!
        </p>

        <div className="bg-gray-100 p-4 rounded-lg text-left text-sm text-gray-700 space-y-1 mb-6">
          <p><strong>Booking ID:</strong> {booking.id}</p>
          <p><strong>Name:</strong> {booking.name}</p>
          <p><strong>Total Paid:</strong> Rp {booking.total_amount.toLocaleString('id-ID')}</p>
        </div>

        <Link href="/" className="inline-block bg-green-500 hover:bg-green-600 transition text-white px-6 py-2 rounded-lg text-sm font-medium shadow">
          Back Home
        </Link>
      </div>
    </div>
  )
}

export default ThankYouClient
