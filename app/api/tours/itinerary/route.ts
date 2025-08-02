import { checkServerSession } from "@/app/lib/checkSession"
import prisma  from "@/app/lib/prisma"
import { ToursItinerarySchema } from "@/app/validations/ToursValidation"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 10)
    const offset = (page - 1) * limit
    const tourId = searchParams.get("tourId")

    if (!tourId) {
      return NextResponse.json(
        { message: "Missing tourId parameter" },
        { status: 400 }
      )
    }

    const [data, total] = await Promise.all([
      prisma.toursItinerary.findMany({
        where: {
          tourId: tourId
        },
        skip: offset,
        take: limit,
        orderBy: {
          created_at: "asc",
        },
      }),
      prisma.toursItinerary.count(),
    ])

    return NextResponse.json({
      message: "Tour's Itinerary Data",
      data,
      total,
      page,
      limit,
    })
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export const POST = async (req: NextRequest) => {
    try {
        const requestData = await req.json();

        checkServerSession()

        const validationData = ToursItinerarySchema.safeParse(requestData)

        if (!validationData.success) {
            return NextResponse.json({
                message: 'Validation failed',
                errors: validationData.error
            }, {status: 400})
        }

        const toursItinerary = await prisma.toursItinerary.create({
           data: requestData
        })

        return NextResponse.json({
            message: "Tour's Itinerary has been added",
            data: toursItinerary
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: 'Internal Server Error'
        }, {status: 500})
    }
}   
