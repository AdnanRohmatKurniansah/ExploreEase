import TourCard from '@/app/(root)/_components/tour-card'
import { Button } from '@/app/components/ui/button'
import prisma from '@/app/lib/prisma'
import { Tours } from '@/app/types/type'
import { ArrowRightCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const TourGrid = async () => {
  const tours = await prisma.tours.findMany()

  return (
    <div className='relative w-full px-5 md:px-15 section-page'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="section-title relative mb-6">
                <div className="absolute -top-2 -left-5">
                <div className="relative w-[80px] md:w-[130px] h-auto aspect-square opacity-30">
                    <Image src="/images/ornaments/island-ornament.png" alt="Island Ornament" fill className="object-contain"/>
                </div>
                </div>
                <div className="title flex justify-start items-center mb-3 md:mb-4">
                    <span></span>
                    <h6 className='font-semibold text-gray-700'>Recommended for You</h6>
                </div>
                <div className="heading">
                    <h3 className='font-bold'>Find the Perfect Experience</h3>
                </div>
            </div>
            <div className="view-all hidden justify-end md:flex">
                <Button className='px-5 py-4'>
                    <Link className='flex items-center' href="/tours">View All <ArrowRightCircle className='w-5 ms-2' /></Link>
                </Button>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {tours.map((tour: Tours, i: number) => (
                <TourCard tour={tour} key={i} />
            ))}
        </div>
        <div className="flex md:hidden justify-center mt-10">
            <Button className='px-5 py-4'>
                <Link className='flex items-center' href="/tours">View All <ArrowRightCircle className='w-5 ms-2' /></Link>
            </Button>
        </div>
    </div>
  )
}

export default TourGrid