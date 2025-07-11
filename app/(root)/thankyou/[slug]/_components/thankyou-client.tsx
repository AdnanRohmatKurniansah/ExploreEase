'use client'

import React from 'react'
import { CheckCircle, Clock, XCircle } from 'lucide-react'

type Booking = {
  id: string
  name: string
  total_amount: number
}

type Props = {
  booking: Booking
  transactionStatus: string
}

const ThankYouClient = ({ booking, transactionStatus }: Props) => {
  const renderStatusIcon = () => {
    if (transactionStatus === 'settlement') return <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
    if (transactionStatus === 'pending') return <Clock className="text-yellow-500 w-16 h-16 mx-auto mb-4" />
    return <XCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl max-w-md w-full p-8 text-center">
        {renderStatusIcon()}
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Thank You!</h1>
        <p className="text-gray-600 mb-4">
          Your payment status: <strong>{transactionStatus}</strong>
        </p>
        <div className="bg-gray-100 p-4 rounded-lg text-left text-sm text-gray-700">
          <p><strong>Booking ID:</strong> {booking.id}</p>
          <p><strong>Name:</strong> {booking.name}</p>
          <p><strong>Total Paid:</strong> Rp {booking.total_amount.toLocaleString('id-ID')}</p>
        </div>

        <a
          href="/"
          className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}

export default ThankYouClient
