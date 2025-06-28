import { checkServerSession } from "@/app/lib/checkSession"
import prisma from "@/app/lib/prisma"
import { generateUniqueSlug, validateFile } from "@/app/lib/utils"
import { Params } from "@/app/types/type"
import { DestinationsUpdateSchema } from "@/app/validations/DestinationsValidation"
import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { uploadToCloudinary } from "@/app/lib/uploadToCloudinary"
import { Blob } from "buffer"

export const GET = async ({params}: { params: Params }) => {
    try {
        const category = await prisma.destinations.findUnique({
            where: {
                id: params.id
            }
        })

        if (!category) {
            return NextResponse.json({
                message: 'Destination not found'
            }, { status: 404 })
        }

        return NextResponse.json({
            message: 'Destination detail',
            data: category
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

        const formData = await req.formData()

        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const image = formData.get('image') as File | null

        let filePath: string | undefined

        const category = await prisma.destinations.findUnique({
            where: {
                id: id
            }
        })

        if (!category) {
            return NextResponse.json({
                message: 'Destination not found'
            }, {status: 404})
        }

        const requestData = DestinationsUpdateSchema.safeParse({ name, description, image })

        if (!requestData.success) {
            return NextResponse.json({
                message: 'Validation failed',
                errors: requestData.error,
            }, { status: 400 })
        }

        const slug = await generateUniqueSlug('destinations', name)

        if (image && image instanceof Blob && image.size > 0) {
            const fileValidationResult = validateFile(image)
            if (fileValidationResult) {
                return NextResponse.json({
                message: fileValidationResult.message
                }, { status: fileValidationResult.status })
            }

            if (category.image) {
                const publicIdMatch = category.image.match(/\/v\d+\/(.+?)\.\w+$/)
                const publicId = publicIdMatch ? publicIdMatch[1] : null
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId)
                }
            }
            filePath = await uploadToCloudinary(image, 'destinations')
        }

        const destinationsData = {
            name,
            slug,
            description,
            image: filePath || category.image
        }
        
        const updatedDestinations = await prisma.destinations.update({
            where: {
                id: id
            },
            data: destinationsData
        })

        return NextResponse.json({
            message: 'Destinations has been updated',
            data: updatedDestinations
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

        const category = await prisma.destinations.findUnique({
            where: {
                id: id
            }
        })

        if (!category) {
            return NextResponse.json({
                message: 'Destinations not found'
            }, {status: 404})
        }

        if (category.image) {
            const publicIdMatch = category.image.match(/\/v\d+\/(.+?)\.\w+$/)
            const publicId = publicIdMatch ? publicIdMatch[1] : null
            if (publicId) {
                await cloudinary.uploader.destroy(publicId)
            }
        }

        const response = await prisma.destinations.delete({
            where: {
                id: id
            }
        })

        return NextResponse.json({
            message: 'Destinations has been deleted',
            data: response
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: 'Internal Server Error'
        }, {status: 500})
    }
}