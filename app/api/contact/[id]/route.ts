import { checkServerSession } from "@/app/lib/checkSession"
import prisma from "@/app/lib/prisma"
import { Params } from "@/app/types/type"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest, {params}: { params: Promise<Params> }) => {
    const { id } = await params

    try {
        const contact = await prisma.contact.findUnique({
            where: {
                id: id
            }
        })

        if (!contact) {
            return NextResponse.json({
                message: 'Contact not found'
            }, { status: 404 })
        }

        await prisma.contact.update({
            where: {
                id: id
            },
            data: {
                status: "Read"
            }
        })

        return NextResponse.json({
            message: 'Contact detail',
            data: contact
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: error
        }, {status: 500})
    }
}

export const DELETE = async (req: NextRequest, { params }: { params: Promise<Params> }) => {
    const { id } = await params

    try {
        checkServerSession()

        const contact = await prisma.contact.findUnique({
            where: {
                id: id
            }
        })

        if (!contact) {
            return NextResponse.json({
                message: 'Contact not found'
            }, {status: 404})
        }

        const response = await prisma.contact.delete({
            where: {
                id: id
            }
        })

        return NextResponse.json({
            message: 'Contact has been deleted',
            data: response
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: 'Internal Server Error'
        }, {status: 500})
    }
}