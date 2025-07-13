import { checkServerSession } from "@/app/lib/checkSession"
import prisma from "@/app/lib/prisma"
import { Params } from "@/app/types/type"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest, {params}: { params: Promise<Params> }) => {
    const { id } = await params

    try {
        const booking = await prisma.bookingTransactions.findUnique({
            where: {
                id: id
            }
        })

        if (!booking) {
            return NextResponse.json({
                message: 'Booking not found'
            }, { status: 404 })
        }

        return NextResponse.json({
            message: 'Booking detail',
            data: booking
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

        const booking = await prisma.bookingTransactions.findUnique({
            where: {
                id: id
            }
        })

        if (!booking) {
            return NextResponse.json({
                message: 'Booking not found'
            }, {status: 404})
        }

        const response = await prisma.bookingTransactions.update({
            where: {
                id: id
            },
            data: {
                read_status: 'Read'
            }
        })

        return NextResponse.json({
            message: 'Contact has been read',
            data: response
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

        const booking = await prisma.bookingTransactions.findUnique({
            where: {
                id: id
            }
        })

        if (!booking) {
            return NextResponse.json({
                message: 'Booking not found'
            }, {status: 404})
        }

        const response = await prisma.bookingTransactions.delete({
            where: {
                id: id
            }
        })

        return NextResponse.json({
            message: 'Booking has been deleted',
            data: response
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: 'Internal Server Error'
        }, {status: 500})
    }
}