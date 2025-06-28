import { checkServerSession } from "@/app/lib/checkSession"
import prisma  from "@/app/lib/prisma"
import { FacilitySchema } from "@/app/validations/FacilityValidation"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 10)
    const offset = (page - 1) * limit

    const [data, total] = await Promise.all([
      prisma.facility.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          title: "asc",
        },
      }),
      prisma.facility.count(),
    ])

    return NextResponse.json({
      message: "Facilities Data",
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

        const validationData = FacilitySchema.safeParse(requestData)

        if (!validationData.success) {
            return NextResponse.json({
                message: 'Validation failed',
                errors: validationData.error
            }, {status: 400})
        }

        const facility = await prisma.facility.create({
           data: requestData
        })

        return NextResponse.json({
            message: 'Facility has been added',
            data: facility
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: 'Internal Server Error'
        }, {status: 500})
    }
}   
