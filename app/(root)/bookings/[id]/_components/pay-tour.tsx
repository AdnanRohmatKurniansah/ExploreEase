'use client'

import { Button } from '@/app/components/ui/button'
import { BookingTransactions } from '@/app/types/type'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

type Props = {
    booking: BookingTransactions
    subtotal: number
    discount: number
    total: number
}

declare global {
  interface Window {
    snap: {
      pay(token: string, callbacks?: {
        onSuccess?: (result: any) => void
        onPending?: (result: any) => void
        onError?: (error: any) => void
        onClose?: () => void
      }): void
    }
  }
}



const PayTour = ({ booking, subtotal, discount, total }: Props) => {
  const router = useRouter()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '')
    script.async = true
    document.body.appendChild(script)

    return () => {
        document.body.removeChild(script)
    }
  }, [])

  const processPayment = () => {
    if (typeof window.snap === 'undefined') {
      alert('Payment system is not loaded. Please refresh the page.')
      return
    }

    window.snap.pay(booking.snap_token, {
      onSuccess: function (result) {
        console.log('Payment success:', result)
        toast.success("Payment Success")
        router.push(`/thankyou/${booking.order_id}`)
      },
      onPending: function (result) {
        console.log('Payment pending:', result)
        toast.info("Waiting your payment")
      },
      onError: function (error) {
        console.error('Payment failed:', error)
        toast.error("Payment failed")
      },
      onClose: function () {
        console.warn('Payment popup closed by user.')
        toast.warning("You closed the popup without finishing the payment")
      }
    })
  }

  return (
    <div className="block md:flex justify-between">
        <div className="text-sm text-gray-600">
            <h4 className="font-semibold mb-1">Customer Message</h4>
            <p>{booking.message || 'No message provided.'}</p>
        </div>
        <div className="total">
            <table className="text-sm w-full md:w-64 mt-6 md:mt-0">
                <tbody>
                    <tr>
                        <td className="py-1">Subtotal:</td>
                      <td className="text-right">Rp {subtotal.toLocaleString('id-ID')}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Discount:</td>
                      <td className="text-right">Rp {discount.toLocaleString('id-ID')}</td>
                    </tr>
                    <tr className="font-bold border-t">
                      <td className="py-2">Total Amount:</td>
                      <td className="text-right">Rp {total.toLocaleString('id-ID')}</td>
                    </tr>
                </tbody>
            </table>
            <div className="flex justify-end">
                <Button onClick={processPayment} className='w-full px-5 py-4 mt-4'>Pay Now</Button>
            </div>
        </div>
    </div>
  )
}

export default PayTour