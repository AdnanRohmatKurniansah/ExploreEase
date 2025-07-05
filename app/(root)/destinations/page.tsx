import { Breadcrumb } from '@/app/components/ui/breadcrumb'
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/app/components/ui/breadcumb'
import { Card } from '@/app/components/ui/card'
import prisma from '@/app/lib/prisma'
import { Destinations } from '@/app/types/type'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Page = async () => {
  const destinations = await prisma.destinations.findMany()

  const destinationIds = destinations.map((dest) => dest.id)

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

  const destinationsWithCount = destinations.map((dest) => ({
    ...dest,
    tourCount: tourCountMap[dest.id] || 0,
  }))

  return (
    <div className='relative w-full'>
      <div className="breadcumb bg-primary-transparent border-b text-black h-10 px-5 md:px-15 flex items-center">
        <Breadcrumb>
          <BreadcrumbList className='text-gray-700'>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Destinations</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="main px-5 md:px-15 py-8 section-page sm">
        <div className="section-title relative mb-2">
          <div className="absolute -top-2 -left-5">
            <div className="relative w-[80px] md:w-[130px] h-auto aspect-square opacity-30">
              <Image src="/images/ornaments/island-ornament.png" alt="island ornament" fill className="object-contain"/>
            </div>
          </div>
          <div className="title flex justify-start items-center mb-3 md:mb-4">
            <span></span>
            <h6 className='font-semibold text-gray-700'>Destinations</h6>
          </div>
          <div className="heading">
            <h3 className='font-bold'>Discover Beautiful Places</h3>
          </div>
        </div>
        <div className="main grid grid-cols-1 md:grid-cols-4 gap-8 pt-3 justify-center items-center">
          {destinationsWithCount.map((destination, i) => (
            <Link key={i + 3} href={`/tours/destination/${destination.slug}`} className="group block">
                <Card className="overflow-hidden gap-0 p-0 hover:shadow-md transition-shadow h-full">
                    <div className="relative w-full aspect-[7/3] md:aspect-square rounded-md overflow-hidden">
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
      </div>      
    </div>
  )
}

export default Page