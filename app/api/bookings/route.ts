import { snap } from "@/app/lib/midtransSnap"
import prisma from "@/app/lib/prisma"
import { SubmitBookingSchema } from "@/app/validations/BookingValidation"
import { NextRequest, NextResponse } from "next/server"
import { sendBookingEmail } from "@/app/lib/sendBookingEmail"
import { getBaseUrl } from "@/app/lib/baseUrl"

export const POST = async (req: NextRequest) => {
  try {
    const requestData = await req.json()

    if (requestData.selectedDate && typeof requestData.selectedDate === 'string') {
      requestData.selectedDate = new Date(requestData.selectedDate)
    }

    const validationData = SubmitBookingSchema.safeParse(requestData)

    if (!validationData.success) {
      return NextResponse.json({
        message: 'Validation failed',
        errors: validationData.error
      }, { status: 400 })
    }

    const { name, phone_number, email, total_amount, total_participant, tourId, selectedDate, message } = validationData.data

    const parameter = {
      transaction_details: {
        order_id: crypto.randomUUID(),
        gross_amount: total_amount
      },
      credit_card: { secure: true },
      customer_details: {
        first_name: name,
        email,
        phone: phone_number
      }
    }

    const token = await snap.createTransactionToken(parameter)

    const bookingData = await prisma.bookingTransactions.create({
      data: {
        name,
        phone_number: phone_number.toString(),
        email,
        total_amount,
        total_participant,
        tourId,
        selectedDate,
        message,
        snap_token: token,
      }
    })

    // const tourData = await prisma.tours.findUnique({ 
    //     where: { 
    //         id: tourId 
    //     }
    // })

    // if (!tourData) {
    //     return NextResponse.json({
    //         message: 'Tour not found',
    //     }, {status: 404})
    // }

    // const itinerary = await prisma.toursItinerary.findMany({ 
    //     where: { 
    //         tourId 
    //     } 
    // })

    // const includeIds = JSON.parse(tourData.include || '[]') as string[]
    // const excludeIds = JSON.parse(tourData.exclude || '[]') as string[]

    // const includes = await prisma.facility.findMany({
    //     where: {
    //         id: {
    //             in: includeIds,
    //         },
    //         type: 'include'
    //     },
    //         orderBy: {
    //         title: 'asc',
    //     }
    // })

    // const excludes = await prisma.facility.findMany({
    //     where: {
    //         id: {
    //             in: excludeIds,
    //         },
    //         type: 'exclude'
    //     },
    //         orderBy: {
    //         title: 'asc',
    //     }
    // })

    // const baseUrl = await getBaseUrl() 
    // const logoUrl = `${baseUrl}/images/logo.png`

    // await sendBookingEmail({
    //   bookingData,
    //   receiver: { email },
    //   sender: { email: process.env.EMAIL_USER || '' },
    //   tourData,
    //   itinerary,
    //   include: includes,
    //   exclude: excludes,
    //   baseUrl, 
    //   logo: logoUrl,
    // })

    return NextResponse.json({
      message: "You have successfully booked",
      data: bookingData
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({
      message: "Internal Server Error",
      error
    }, { status: 500 })
  }
}
