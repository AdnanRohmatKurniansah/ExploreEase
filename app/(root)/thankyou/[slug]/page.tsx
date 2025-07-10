'use client'

import { useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import React from 'react'

const ThankYouPage = () => {
  const searchParams = useSearchParams()
  const transactionId = searchParams.get('transaction_id')
  const status = searchParams.get('status')

  const getStatusText = () => {
    if (status === 'success') return 'was successful'
    if (status === 'pending') return 'is pending'
    return 'is being processed'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl max-w-md w-full p-8 text-center">
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Thank You!</h1>
        <p className="text-gray-600 mb-4">
          Your payment {getStatusText()}.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg text-left text-sm text-gray-700">
          <p><strong>Transaction ID:</strong> {transactionId || '-'}</p>
          <p><strong>Payment Status:</strong> {status || '-'}</p>
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

export default ThankYouPage
