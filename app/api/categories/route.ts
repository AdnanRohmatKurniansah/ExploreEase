import { checkServerSession } from "@/app/lib/checkSession"
import prisma  from "@/app/lib/prisma"
import { uploadToCloudinary } from "@/app/lib/uploadToCloudinary"
import { generateUniqueSlug } from "@/app/lib/utils"
import { validateFile } from "@/app/lib/utils"
import { CategoriesSchema } from "@/app/validations/CategoriesValidation"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 10)
    const offset = (page - 1) * limit

    const [data, total] = await Promise.all([
      prisma.categories.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          name: "asc",
        },
      }),
      prisma.categories.count(),
    ])

    return NextResponse.json({
      message: "Categories Data",
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

        const requestData = CategoriesSchema.safeParse({
            name: formData.get('name'),
            description: formData.get('description'),
            icon: formData.get('icon'),
        })

        if (!requestData.success) {
            return NextResponse.json({
                message: 'Validation failed',
                errors: requestData.error,
            }, { status: 400 })
        }

        const { name, description, icon } = requestData.data

        if (icon) {
            const fileValidationResult = validateFile(icon)

            if (fileValidationResult) {
                return NextResponse.json({
                message: fileValidationResult.message
                }, { status: fileValidationResult.status })
            }

            const cloudinaryUrl = await uploadToCloudinary(icon, 'categories')

            const slug = await generateUniqueSlug('categories', name)

            const categories = await prisma.categories.create({
                data: {
                    name,
                    slug,
                    description,
                    icon: cloudinaryUrl,
                }
            })

            return NextResponse.json({
                message: 'Categories has been added',
                data: categories,
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
