import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import prisma from '@/app/lib/prisma'
import { Destinations } from '@/app/types/type'
import { ArrowRight, ArrowRightCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const DestinationGrid = async () => {
  const destinations = await prisma.destinations.findMany({
    take: 5,
  })

  const shuffled = destinations.sort(() => 0.5 - Math.random())
  const randomDestinations = shuffled.slice(0, 5)

  const destinationIds = randomDestinations.map((dest) => dest.id)

  const tourCounts = await prisma.tours.groupBy({
    by: ['destinationId'],
    _count: { destinationId: true },
    where: {
        destinationId: {
        in: destinationIds,
        },
    },
  })

  const tourCountMap: Record<string, number> = {}
    tourCounts.forEach((item) => {
    tourCountMap[item.destinationId] = item._count.destinationId
  })

  const enrichedDestinations = randomDestinations.map((dest) => ({
    ...dest,
    tourCount: tourCountMap[dest.id] || 0,
  }))

  const firstRow = enrichedDestinations.slice(0, 3)
  const secondRow = enrichedDestinations.slice(3)

  return (
    <div className="relative w-full px-5 md:px-15 section-page bg-[#F3F6F9]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="section-title relative mb-6">
          <div className="absolute -top-2 -left-5">
            <div className="relative w-[80px] md:w-[130px] h-auto aspect-square opacity-30">
              <Image
                src="/images/ornaments/destination-ornament.png"
                alt="Destination Ornament"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="title flex justify-start items-center mb-3 md:mb-4">
            <span></span>
            <h6 className="font-semibold text-gray-700">Top Destinations</h6>
          </div>
          <div className="heading">
            <h3 className="font-bold">Your Next Adventure Awaits</h3>
          </div>
        </div>
        <div className="view-all hidden justify-end md:flex">
          <Button className="px-5 py-4">
            <Link className="flex items-center" href="/destinations">
              View All <ArrowRightCircle className="w-5 ms-2" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        {firstRow.map((destination, i) => (
          <Link key={i} href={`/destinations/${destination.slug}`} className="group block">
            <Card className="overflow-hidden gap-0 p-0 hover:shadow-md transition-shadow h-full">
                <div className="relative w-full aspect-[6/3] rounded-md overflow-hidden">
                    <div className="absolute top-5 left-5 z-20 text-white">
                        <h4 className='font-medium mb-1'>{destination.name}</h4>
                        <p className='font-medium text-[12px]'>{destination.tourCount} Package</p>
                    </div>

                    <Image alt={destination.name} src={destination.image} fill className="object-cover transition-transform duration-300 group-hover:scale-105"/>

                    <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-black opacity-80 to-transparent z-10"></div>

                    <div className="absolute bottom-5 right-5 flex items-center justify-center text-center bg-white z-20 w-10 h-10 rounded-full">
                      <ArrowRight className="mx-auto" />
                    </div>
                </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
        {secondRow.map((destination, i) => (
          <Link key={i + 3} href={`/destinations/${destination.slug}`} className="group block">
            <Card className="overflow-hidden gap-0 p-0 hover:shadow-md transition-shadow h-full">
                <div className="relative w-full aspect-[7/3] rounded-md overflow-hidden">
                    <div className="absolute top-5 left-5 z-20 text-white">
                        <h4 className='font-medium mb-1'>{destination.name}</h4>
                        <p className='font-medium text-[12px]'>{destination.tourCount} Package</p>
                    </div>

                    <Image alt={destination.name} src={destination.image} fill className="object-cover transition-transform duration-300 group-hover:scale-105"/>
                    <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-black opacity-80 to-transparent z-10"></div>

                    <div className="absolute bottom-5 right-5 flex items-center justify-center text-center bg-white z-20 w-10 h-10 rounded-full">
                      <ArrowRight className="mx-auto" />
                    </div>
                </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex md:hidden justify-center mt-10">
        <Button className="px-5 py-4">
          <Link className="flex items-center" href="/destinations">
            View All <ArrowRightCircle className="w-5 ms-2" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default DestinationGrid
