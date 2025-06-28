import { checkServerSession } from "@/app/lib/checkSession"
import prisma from "@/app/lib/prisma"
import { Params } from "@/app/types/type"
import { FacilityUpdateSchema } from "@/app/validations/FacilityValidation"
import { NextRequest, NextResponse } from "next/server"

export const GET = async ({params}: { params: Params }) => {
    try {
        const facility = await prisma.facility.findUnique({
            where: {
                id: params.id
            }
        })

        if (!facility) {
            return NextResponse.json({
                message: 'Facility not found'
            }, { status: 404 })
        }

        return NextResponse.json({
            message: 'Facility detail',
            data: facility
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

        const facility = await prisma.facility.findUnique({
            where: {
                id: id
            }
        })

        if (!facility) {
            return NextResponse.json({
                message: 'Facility not found'
            }, {status: 404})
        }

        const requestData = await req.json();
        
        const validationData = FacilityUpdateSchema.safeParse(requestData)
        
        if (!validationData.success) {
            return NextResponse.json({
                message: 'Validation failed',
                errors: validationData.error
            }, {status: 400})
        }

        const updatedFacility = await prisma.facility.update({
            where: {
                id: id
            },
            data: requestData
        })

        return NextResponse.json({
            message: 'Facility has been updated',
            data: updatedFacility
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

        const facility = await prisma.facility.findUnique({
            where: {
                id: id
            }
        })

        if (!facility) {
            return NextResponse.json({
                message: 'Facility not found'
            }, {status: 404})
        }

        const response = await prisma.facility.delete({
            where: {
                id: id
            }
        })

        return NextResponse.json({
            message: 'Facility has been deleted',
            data: response
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: 'Internal Server Error'
        }, {status: 500})
    }
}