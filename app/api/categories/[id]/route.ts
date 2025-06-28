import { checkServerSession } from "@/app/lib/checkSession"
import prisma from "@/app/lib/prisma"
import { generateUniqueSlug, validateFile } from "@/app/lib/utils"
import { Params } from "@/app/types/type"
import { CategoriesUpdateSchema } from "@/app/validations/CategoriesValidation"
import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { uploadToCloudinary } from "@/app/lib/uploadToCloudinary"
import { Blob } from "buffer"

export const GET = async ({params}: { params: Params }) => {
    try {
        const category = await prisma.categories.findUnique({
            where: {
                id: params.id
            }
        })

        if (!category) {
            return NextResponse.json({
                message: 'Category not found'
            }, { status: 404 })
        }

        return NextResponse.json({
            message: 'Category detail',
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
        const icon = formData.get('icon') as File | null

        let filePath: string | undefined

        const category = await prisma.categories.findUnique({
            where: {
                id: id
            }
        })

        if (!category) {
            return NextResponse.json({
                message: 'Category not found'
            }, {status: 404})
        }

        const requestData = CategoriesUpdateSchema.safeParse({ name, description, icon })

        if (!requestData.success) {
            return NextResponse.json({
                message: 'Validation failed',
                errors: requestData.error,
            }, { status: 400 })
        }

        const slug = await generateUniqueSlug('categories', name)

        if (icon && icon instanceof Blob && icon.size > 0) {
            const fileValidationResult = validateFile(icon)
            if (fileValidationResult) {
                return NextResponse.json({
                message: fileValidationResult.message
                }, { status: fileValidationResult.status })
            }

            if (category.icon) {
                const publicIdMatch = category.icon.match(/\/v\d+\/(.+?)\.\w+$/)
                const publicId = publicIdMatch ? publicIdMatch[1] : null
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId)
                }
            }
            filePath = await uploadToCloudinary(icon, 'categories')
        }

        const categoriesData = {
            name,
            slug,
            description,
            icon: filePath || category.icon
        }
        
        const updatedCategory = await prisma.categories.update({
            where: {
                id: id
            },
            data: categoriesData
        })

        return NextResponse.json({
            message: 'Category has been updated',
            data: updatedCategory
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

        const category = await prisma.categories.findUnique({
            where: {
                id: id
            }
        })

        if (!category) {
            return NextResponse.json({
                message: 'Category not found'
            }, {status: 404})
        }

        if (category.icon) {
            const publicIdMatch = category.icon.match(/\/v\d+\/(.+?)\.\w+$/)
            const publicId = publicIdMatch ? publicIdMatch[1] : null
            if (publicId) {
                await cloudinary.uploader.destroy(publicId)
            }
        }

        const response = await prisma.categories.delete({
            where: {
                id: id
            }
        })

        return NextResponse.json({
            message: 'Category has been deleted',
            data: response
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: 'Internal Server Error'
        }, {status: 500})
    }
}