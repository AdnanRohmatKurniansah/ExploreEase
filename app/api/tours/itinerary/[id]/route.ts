import { checkServerSession } from "@/app/lib/checkSession"
import prisma from "@/app/lib/prisma"
import { Params } from "@/app/types/type"
import { ToursItineraryUpdateSchema } from "@/app/validations/ToursValidation"
import { NextRequest, NextResponse } from "next/server"

export const GET = async ({params}: { params: Params }) => {
    try {
        const toursItinerary = await prisma.toursItinerary.findUnique({
            where: {
                id: params.id
            }
        })

        if (!toursItinerary) {
            return NextResponse.json({
                message: "Tour's Itinerary not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            message: "Tour's Itinerary detail",
            data: toursItinerary
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

        const toursItinerary = await prisma.toursItinerary.findUnique({
            where: {
                id: id
            }
        })

        if (!toursItinerary) {
            return NextResponse.json({
                message: "Tour's Itinerary not found"
            }, {status: 404})
        }

        const requestData = await req.json();
        
        const validationData = ToursItineraryUpdateSchema.safeParse(requestData)
        
        if (!validationData.success) {
            return NextResponse.json({
                message: 'Validation failed',
                errors: validationData.error
            }, {status: 400})
        }

        const updatedTourItinerary = await prisma.toursItinerary.update({
            where: {
                id: id
            },
            data: requestData
        })

        return NextResponse.json({
            message: "Tour's Itinerary has been updated",
            data: updatedTourItinerary
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

        const toursItinerary = await prisma.toursItinerary.findUnique({
            where: {
                id: id
            }
        })

        if (!toursItinerary) {
            return NextResponse.json({
                message: "Tour's Itinerary not found"
            }, {status: 404})
        }

        const response = await prisma.toursItinerary.delete({
            where: {
                id: id
            }
        })

        return NextResponse.json({
            message: "Tour's Itinerary has been deleted",
            data: response
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: 'Internal Server Error'
        }, {status: 500})
    }
}