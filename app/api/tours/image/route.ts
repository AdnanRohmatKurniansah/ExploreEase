import { checkServerSession } from "@/app/lib/checkSession"
import prisma  from "@/app/lib/prisma"
import { uploadToCloudinary } from "@/app/lib/uploadToCloudinary"
import { validateFile } from "@/app/lib/utils"
import { ToursImageSchema } from "@/app/validations/ToursValidation"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 10)
    const offset = (page - 1) * limit

    const [data, total] = await Promise.all([
      prisma.toursImage.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          created_at: "desc",
        },
      }),
      prisma.toursImage.count(),
    ])

    return NextResponse.json({
      message: "Tours Image Data",
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
        const formData = await req.formData()

        checkServerSession()

        const requestData = ToursImageSchema.safeParse({
            title: formData.get('title'),
            tourId: formData.get('tourId'),
            image: formData.get('image'),
        })

        if (!requestData.success) {
            return NextResponse.json({
                message: 'Validation failed',
                errors: requestData.error,
            }, { status: 400 })
        }

        const { title, tourId, image } = requestData.data

        if (image) {
            const fileValidationResult = validateFile(image)

            if (fileValidationResult) {
                return NextResponse.json({
                message: fileValidationResult.message
                }, { status: fileValidationResult.status })
            }

            const cloudinaryUrl = await uploadToCloudinary(image, 'toursImage')

            const toursImage = await prisma.toursImage.create({
                data: {
                    title,
                    tourId,
                    image: cloudinaryUrl,
                }
            })

            return NextResponse.json({
                message: 'Tours Image has been added',
                data: toursImage,
            })
        } else {
            return NextResponse.json({
                error: 'No file uploaded',
            }, { status: 400 })
        }
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: 'Internal Server Error'
        }, {status: 500})
    }
}   
