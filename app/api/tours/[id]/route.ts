import { checkServerSession } from "@/app/lib/checkSession"
import prisma from "@/app/lib/prisma"
import { generateUniqueSlug, validateFile } from "@/app/lib/utils"
import { Params } from "@/app/types/type"
import { ToursUpdateSchema } from "@/app/validations/ToursValidation"
import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { uploadToCloudinary } from "@/app/lib/uploadToCloudinary"
import { Blob } from "buffer"

export const GET = async ({params}: { params: Params }) => {
    try {
        const tour = await prisma.tours.findUnique({
            where: {
                id: params.id
            }
        })

        if (!tour) {
            return NextResponse.json({
                message: 'Tour not found'
            }, { status: 404 })
        }

        return NextResponse.json({
            message: 'Tour detail',
            data: tour
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: error
        }, {status: 500})
    }
}

export const PUT = async (req: NextRequest, {params}: {params: Params}) => {
    const { id } = params

    try {
        checkServerSession()

        const tour = await prisma.tours.findUnique({
            where: {
                id: id
            }
        })

        if (!tour) {
            return NextResponse.json({
                message: 'Tour not found'
            }, {status: 404})
        }

        const formData = await req.formData()

        const includeRaw = formData.get('include')?.toString() || '[]'
        const excludeRaw = formData.get('exclude')?.toString() || '[]'

        const requestData = ToursUpdateSchema.safeParse({
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
            image: formData.get('image') as File | null,
        })

        let filePath: string | undefined

        if (!requestData.success) {
            return NextResponse.json({
                message: 'Validation failed',
                errors: requestData.error,
            }, { status: 400 })
        }

        const { title, description, highlight, price, discount_price, categoryId, destinationId, include, exclude, location, image } = requestData.data

        const slug = await generateUniqueSlug('tours', title)
        const is_popular = formData.get('is_popular') === '1' ? true : false

        if (image && image instanceof Blob && image.size > 0) {
            const fileValidationResult = validateFile(image)
            if (fileValidationResult) {
                return NextResponse.json({
                message: fileValidationResult.message
                }, { status: fileValidationResult.status })
            }

            if (tour.image) {
                const publicIdMatch = tour.image.match(/\/v\d+\/(.+?)\.\w+$/)
                const publicId = publicIdMatch ? publicIdMatch[1] : null
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId)
                }
            }
            filePath = await uploadToCloudinary(image, 'tours')
        }

        const toursData = {
            title,
            slug,
            description,
            highlight,
            price,
            discount_price,
            categoryId,
            destinationId,
            is_popular,
            include: JSON.stringify(include),
            exclude: JSON.stringify(exclude),
            location,
            image: filePath || tour.image
        }
        
        const updatedTour = await prisma.tours.update({
            where: {
                id: id
            },
            data: toursData
        })

        return NextResponse.json({
            message: 'Tour has been updated',
            data: updatedTour
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: 'Internal Server Error'
        }, { status: 500 })
    }
}

export const DELETE = async (req: NextRequest, { params }: {params: Params}) => {
    const { id } = params

    try {
        checkServerSession()

        const tour = await prisma.tours.findUnique({
            where: {
                id: id
            }
        })

        if (!tour) {
            return NextResponse.json({
                message: 'Tour not found'
            }, {status: 404})
        }

        if (tour.image) {
            const publicIdMatch = tour.image.match(/\/v\d+\/(.+?)\.\w+$/)
            const publicId = publicIdMatch ? publicIdMatch[1] : null
            if (publicId) {
                await cloudinary.uploader.destroy(publicId)
            }
        }

        const response = await prisma.tours.delete({
            where: {
                id: id
            }
        })

        return NextResponse.json({
            message: 'Tour has been deleted',
            data: response
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: 'Internal Server Error'
        }, {status: 500})
    }
}