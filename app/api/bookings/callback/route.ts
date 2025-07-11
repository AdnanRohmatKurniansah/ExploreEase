import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/app/lib/prisma'
import { sendBookingEmail } from '@/app/lib/sendBookingEmail'
import { getBaseUrl } from '@/app/lib/baseUrl'

export const POST = async (req: Request) => {
  try {
    const body = await req.json()

    const { order_id, status_code, gross_amount, signature_key, transaction_status, payment_type } = body

    const serverKey = process.env.MIDTRANS_SERVER_KEY || ''
    const input = order_id + status_code + gross_amount + serverKey

    const hash = crypto.createHash('sha512').update(input).digest('hex')

    if (hash === signature_key) {
      if (transaction_status === 'capture' || transaction_status === 'settlement') {
        const bookingData = await prisma.bookingTransactions.update({
          where: { 
            order_id 
          },
          data: {
            payment_status: 'Paid', 
            payment_method: payment_type
          },
        })

        const tourData = await prisma.tours.findUnique({ 
          where: { 
            id: bookingData.tourId 
          }
        })

        if (!tourData) {
            return NextResponse.json({
                message: 'Tour not found',
            }, {status: 404})
        }

        const itinerary = await prisma.toursItinerary.findMany({ 
            where: { 
                tourId: bookingData.tourId 
            } 
        })

        const includeIds = JSON.parse(tourData.include || '[]') as string[]
        const excludeIds = JSON.parse(tourData.exclude || '[]') as string[]

        const includes = await prisma.facility.findMany({
            where: {
                id: {
                    in: includeIds,
                },
                type: 'include'
            },
                orderBy: {
                title: 'asc',
            }
        })

        const excludes = await prisma.facility.findMany({
            where: {
                id: {
                    in: excludeIds,
                },
                type: 'exclude'
            },
                orderBy: {
                title: 'asc',
            }
        })

        const baseUrl = await getBaseUrl() 
        const logoUrl = `${baseUrl}/images/logo.png`

        await sendBookingEmail({
          bookingData,
          receiver: { 
            email: bookingData.email 
          },
          sender: { 
            email: process.env.EMAIL_USER || '' 
          },
          tourData,
          itinerary,
          include: includes,
          exclude: excludes,
          baseUrl, 
          logo: logoUrl,
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
