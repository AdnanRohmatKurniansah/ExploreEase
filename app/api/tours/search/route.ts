import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const category = searchParams.get('category')
  const destination = searchParams.get('destination')
  const price = parseInt(searchParams.get('price') || '0', 10)
  const priceMax = 10000000

  try {
    const tours = await prisma.tours.findMany({
      where: {
        ...(category !== 'all' && { category: { slug: category! } }),
        ...(destination !== 'all' && { destination: { slug: destination! } }),
        OR: [
          {
            discount_price: {
              gte: price,
              lte: priceMax,
            },
          },
          {
            discount_price: null,
            price: {
              gte: price,
              lte: priceMax,
            },
          },
        ],
      },
      include: {
        category: true,
        destination: true,
      },
    })

    return NextResponse.json(tours)
  } catch (error) {
    console.error('Error fetching filtered tours:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
