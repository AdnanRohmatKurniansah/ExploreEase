import { checkServerSession } from "@/app/lib/checkSession"
import prisma from "@/app/lib/prisma"
import { validateFile } from "@/app/lib/utils"
import { Params } from "@/app/types/type"
import { ToursImageUpdateSchema } from "@/app/validations/ToursValidation"
import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { uploadToCloudinary } from "@/app/lib/uploadToCloudinary"
import { Blob } from "buffer"

export const GET = async (req: NextRequest, {params}: { params: Promise<Params> }) => {
    const { id } = await params
    
    try {
        const tourImage = await prisma.toursImage.findUnique({
            where: {
                id: id
            }
        })

        if (!tourImage) {
            return NextResponse.json({
                message: 'Tour Image not found'
            }, { status: 404 })
        }

        return NextResponse.json({
            message: 'Tour Image detail',
            data: tourImage
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: error
        }, {status: 500})
    }
}

export const PUT = async (req: NextRequest, {params}: { params: Promise<Params> }) => {
    const { id } = await params

    try {
        checkServerSession()

        const formData = await req.formData()

        const title = formData.get('title') as string
        const image = formData.get('image') as File | null

        let filePath: string | undefined

        const tourImage = await prisma.toursImage.findUnique({
            where: {
                id: id
            }
        })

        if (!tourImage) {
            return NextResponse.json({
                message: 'Tour Image not found'
            }, {status: 404})
        }

        const requestData = ToursImageUpdateSchema.safeParse({ title, image })

        if (!requestData.success) {
            return NextResponse.json({
                message: 'Validation failed',
                errors: requestData.error,
            }, { status: 400 })
        }

        if (image && image instanceof Blob && image.size > 0) {
            const fileValidationResult = validateFile(image)
            if (fileValidationResult) {
                return NextResponse.json({
                message: fileValidationResult.message
                }, { status: fileValidationResult.status })
            }

            if (tourImage.image) {
                const publicIdMatch = tourImage.image.match(/\/v\d+\/(.+?)\.\w+$/)
                const publicId = publicIdMatch ? publicIdMatch[1] : null
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId)
                }
            }
            filePath = await uploadToCloudinary(image, 'toursImage')
        }

        const toursImageData = {
            title,
            image: filePath || tourImage.image
        }
        
        const updatedTourImage = await prisma.toursImage.update({
            where: {
                id: id
            },
            data: toursImageData
        })

        return NextResponse.json({
            message: 'Tour Image has been updated',
            data: updatedTourImage
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: 'Internal Server Error'
        }, { status: 500 })
    }
}

export const DELETE = async (req: NextRequest, { params }: { params: Promise<Params> }) => {
    const { id } = await params

    try {
        checkServerSession()

        const tourImage = await prisma.toursImage.findUnique({
            where: {
                id: id
            }
        })

        if (!tourImage) {
            return NextResponse.json({
                message: 'Tour Image not found'
            }, {status: 404})
        }

        if (tourImage.image) {
            const publicIdMatch = tourImage.image.match(/\/v\d+\/(.+?)\.\w+$/)
            const publicId = publicIdMatch ? publicIdMatch[1] : null
            if (publicId) {
                await cloudinary.uploader.destroy(publicId)
            }
        }

        const response = await prisma.toursImage.delete({
            where: {
                id: id
            }
        })

        return NextResponse.json({
            message: 'Tour Image has been deleted',
            data: response
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: 'Internal Server Error'
        }, {status: 500})
    }
}