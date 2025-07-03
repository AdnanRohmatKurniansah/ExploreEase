'use client'

import React from 'react'
import { Card } from '@/app/components/ui/card'
import { Tours } from '@/app/types/type'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, Star } from 'lucide-react'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'

const TourCard = ({ tour }: { tour: Tours }) => {
  return (
    <Link href={`/tours/${tour.slug}`} className="group block">
      <Card className="overflow-hidden gap-0 p-3 hover:shadow-md transition-shadow">
        <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden">
          <Image alt={tour.title} src={tour.image} fill className="object-cover transition-transform duration-300 group-hover:scale-105"/>

          {tour.is_popular && (
            <div className="absolute left-2 top-2">
                <Badge className='px-2 py-0'><Star className='w-3 me-1' /> Popular</Badge>
            </div>
          )}

          <div className="absolute right-2 top-2">
            <Button className="w-8 h-8 bg-white rounded-full p-0 hover:bg-white">
                <Heart className="w-4 h-4 text-black" />
            </Button>
          </div>
        </div>
        <h4 className="font-semibold text-md mt-3">{tour.title}</h4>
        <p className="text-sm text-muted-foreground mt-2 flex items-center border-b pb-2"><MapPin className='w-5 me-1' /> {tour.location}</p>
        <div className="price font-semibold text-md mt-2">
        {tour.discount_price != null ? (
            <div className='font-semibold'>
                <h5 className="line-through text-red-600 me-2">From Rp {tour.price.toLocaleString()}</h5>
                <h5>From Rp {tour.discount_price.toLocaleString()}</h5>
            </div>
        ) : (
            <h5 className='font-semibold'>From Rp {tour.price.toLocaleString()}</h5>
        )}
        </div>
      </Card>
    </Link>
  )
}

export default TourCard
