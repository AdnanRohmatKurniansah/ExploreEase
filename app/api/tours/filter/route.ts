import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)

  const category = searchParams.get('category')
  const destination = searchParams.get('destination')
  
  const price = parseInt(searchParams.get('price') || '0', 10)
  const priceMax = 10000000

  const search = searchParams.get('search')

  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '12', 10)
  const skip = (page - 1) * limit

  try {
    const [tours, total] = await Promise.all([
      prisma.tours.findMany({
        where: {
          ...(search?.trim() && {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          }),
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
        take: limit,
        skip,
      }),
      prisma.tours.count({
        where: {
          ...(search?.trim() && {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          }),
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
      }),
    ])

    return NextResponse.json({ 
      message: 'Success fetching filtered tours',
      tours, 
      total 
    })
  } catch (error) {
    console.error('Error fetching filtered tours:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
