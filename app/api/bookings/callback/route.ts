import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/app/lib/prisma'

export const POST = async (req: Request) => {
  try {
    const body = await req.json()

    const { order_id, status_code, gross_amount, signature_key, transaction_status } = body

    const serverKey = process.env.MIDTRANS_SERVER_KEY || ''
    const input = order_id + status_code + gross_amount + serverKey

    const hash = crypto.createHash('sha512').update(input).digest('hex')

    if (hash === signature_key) {
      if (transaction_status === 'capture' || transaction_status === 'settlement') {
        await prisma.bookingTransactions.update({
          where: { id: order_id },
          data: {
            payment_status: 'Paid', 
          },
        })

        return NextResponse.json({ 
            message: 'Payment updated successfully' 
        }, { status: 200 })
      } else {
        return NextResponse.json({ 
            message: 'Transaction status not completed' 
        }, { status: 200 })
      }
    } else {
      return NextResponse.json({ 
        message: 'Invalid signature key' 
      }, { status: 403 })
    }

  } catch (error) {
    console.error('Midtrans callback error:', error)
    return NextResponse.json({ 
        message: 'Internal server error' 
    }, { status: 500 })
  }
}
