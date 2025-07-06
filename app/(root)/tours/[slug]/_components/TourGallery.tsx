'use client'

import React, { useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/app/components/ui/breadcrumb'
import { BreadcrumbList, BreadcrumbSeparator } from '@/app/components/ui/breadcumb'
import Image from 'next/image'
import { Tours, ToursImage } from '@/app/types/type'
import { Button } from '@/app/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  tour: Tours
  tourImages: ToursImage[]
}

const TourGallery = ({ tour, tourImages }: Props) => {
  const [currentImage, setCurrentImage] = useState(0)

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? tourImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentImage((prev) => (prev === tourImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className='mb-5'>
      <div className="relative w-full mb-4 rounded-lg overflow-hidden">
        {tourImages.length > 0 && (
          <>
            <Image src={tourImages[currentImage].image} alt={tourImages[currentImage].title} width={800} height={450} className="w-full h-[300px] md:h-[450px] object-cover rounded-lg"/>
            <Button onClick={handlePrev} className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow"><ChevronLeft /></Button>
            <Button onClick={handleNext} className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow"><ChevronRight /></Button>
          </>
        )}
      </div>
      {tourImages.length > 1 && (
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {tourImages.map((img, i) => (
          <div key={i} onClick={() => setCurrentImage(i)} className={`rounded cursor-pointer border ${i === currentImage ? 'border-red-500' : 'border-transparent'} rounded`}>
            <Image src={img.image} alt={img.title} width={100} height={100} className="rounded-md object-cover h-[100px] md:h-[120px] w-full"/>
          </div>
        ))}
      </div>
      )}
    </div>
  )
}

export default TourGallery
