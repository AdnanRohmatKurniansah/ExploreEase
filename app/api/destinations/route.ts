import { checkServerSession } from "@/app/lib/checkSession"
import prisma  from "@/app/lib/prisma"
import { uploadToCloudinary } from "@/app/lib/uploadToCloudinary"
import { generateUniqueSlug } from "@/app/lib/utils"
import { validateFile } from "@/app/lib/utils"
import { DestinationsSchema } from "@/app/validations/DestinationsValidation"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 10)
    const offset = (page - 1) * limit

    const [data, total] = await Promise.all([
      prisma.destinations.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          name: "asc",
        },
      }),
      prisma.destinations.count(),
    ])

    return NextResponse.json({
      message: "Destinations Data",
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

        const requestData = DestinationsSchema.safeParse({
            name: formData.get('name'),
            description: formData.get('description'),
            image: formData.get('image'),
        })

        if (!requestData.success) {
            return NextResponse.json({
                message: 'Validation failed',
                errors: requestData.error,
            }, { status: 400 })
        }

        const { name, description, image } = requestData.data

        if (image) {
            const fileValidationResult = validateFile(image)

            if (fileValidationResult) {
                return NextResponse.json({
                message: fileValidationResult.message
                }, { status: fileValidationResult.status })
            }

            const cloudinaryUrl = await uploadToCloudinary(image, 'destinations')

            const slug = await generateUniqueSlug('destinations', name)

            const destinations = await prisma.destinations.create({
                data: {
                    name,
                    slug,
                    description,
                    image: cloudinaryUrl,
                }
            })

            return NextResponse.json({
                message: 'Destinations has been added',
                data: destinations,
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
