import { getServerSession } from "next-auth"
import { authOptions } from "./authOptions"
import { NextResponse } from "next/server";

export const checkServerSession = async () => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({
            error: 'User not authenticated'
        }, { status: 401 })
    }
}