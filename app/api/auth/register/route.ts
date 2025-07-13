import prisma from "@/app/lib/prisma";
import { RegisterSchema } from "@/app/validations/AuthValidation";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
    try {
        const requestData = await req.json();

        // const validationData = RegisterSchema.safeParse(requestData)

        // if (!validationData.success) {
        //     return NextResponse.json({
        //         message: 'Validation failed',
        //         errors: validationData.error
        //     }, {status: 400})
        // }

        // const userExist = await prisma.user.findUnique({
        //      where: {
        //          username: requestData.username
        //      }
        // })
        // if (userExist) {
        //     return NextResponse.json({
        //         message: 'User already exist'
        //     }, {status: 409})
        // }

        // const hashedPassword = await hash(requestData.password, 10)

        // requestData.password = hashedPassword
        // const user = await prisma.user.create({
        //    data: requestData
        // })

        // return NextResponse.json({
        //     message: 'Register successfully',
        //     data: user
        // })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: 'Internal Server Error'
        }, {status: 500})
    }
}