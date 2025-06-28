import { checkServerSession } from "@/app/lib/checkSession"
import prisma  from "@/app/lib/prisma"
import { uploadToCloudinary } from "@/app/lib/uploadToCloudinary"
import { generateUniqueSlug } from "@/app/lib/utils"
import { validateFile } from "@/app/lib/utils"
import { ToursSchema } from "@/app/validations/ToursValidation"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.tours.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          title: "asc",
        },
        include: {
          category: {
            select: {
              name: true,
            },
          },
          destination: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.tours.count(),
    ]);

    return NextResponse.json({
      message: "Tours Data",
      data,
      total,
      page,
      limit,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
    try {
        checkServerSession()
        
        const formData = await req.formData()

        const includeRaw = formData.get('include')?.toString() || '[]'
        const excludeRaw = formData.get('exclude')?.toString() || '[]'

        const requestData = ToursSchema.safeParse({
            title: formData.get('title'),
            description: formData.get('description'),
            highlight: formData.get('highlight'),
            price: Number(formData.get('price')),
            discount_price: Number(formData.get('discount_price')),
            categoryId: formData.get('categoryId'),
            destinationId: formData.get('destinationId'),
            is_popular: formData.get('is_popular'),
            include: JSON.parse(includeRaw),
            exclude: JSON.parse(excludeRaw),
            location: formData.get('location'),
            image: formData.get('image'),
        })

        if (!requestData.success) {
            return NextResponse.json({
                message: 'Validation failed',
                errors: requestData.error,
            }, { status: 400 })
        }

        const { title, description, highlight, price, discount_price, categoryId, destinationId, include, exclude, location, image } = requestData.data

        if (image) {
            const fileValidationResult = validateFile(image)

            if (fileValidationResult) {
                return NextResponse.json({
                message: fileValidationResult.message
                }, { status: fileValidationResult.status })
            }

            const cloudinaryUrl = await uploadToCloudinary(image, 'tours')

            const slug = await generateUniqueSlug('tours', title)
            const is_popular = formData.get('is_popular') === '1' ? true : false

            const tours = await prisma.tours.create({
                data: {
                    title,
                    slug,
                    description,
                    highlight,
                    price,
                    discount_price,
                    categoryId,
                    destinationId,
                    is_popular,
                    location,
                    include: JSON.stringify(include),
                    exclude: JSON.stringify(exclude),
                    image: cloudinaryUrl,
                }
            })

            return NextResponse.json({
                message: 'Tours has been added',
                data: tours,
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
