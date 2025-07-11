import { snap } from "@/app/lib/midtransSnap"
import prisma from "@/app/lib/prisma"
import { SubmitBookingSchema } from "@/app/validations/BookingValidation"
import { NextRequest, NextResponse } from "next/server"

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
        order_id: parameter.transaction_details.order_id,
        snap_token: token,
      }
    })
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
