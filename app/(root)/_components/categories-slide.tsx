import { Card, CardContent } from '@/app/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/app/components/ui/carousel'
import prisma from '@/app/lib/prisma'
import { Categories } from '@/app/types/type'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CategoriesSlide = async () => {
  const categories = await prisma.categories.findMany()
  const shuffled = categories.sort(() => 0.5 - Math.random())
  const randomCategories = shuffled.slice(0, 5)


  const categoriesHead = {
    title: "Browse by category",
    heading: "Find Your Perfect Tour" 
  }

  return (
    <div className='relative w-full px-5 md:px-15 section-page high-top short-top'>
        <div className="section-title relative">
            <div className="absolute -top-2 -left-5">
              <div className="relative w-[80px] md:w-[130px] h-auto aspect-square opacity-30">
                <Image src="/images/ornaments/bag-ornament.png" alt="bag ornament" fill className="object-contain"/>
              </div>
            </div>
            <div className="title flex justify-start items-center mb-3 md:mb-4">
                <span></span>
                <h6 className='font-semibold text-gray-700'>{categoriesHead.title}</h6>
            </div>
            <div className="heading">
                <h3 className='font-bold'>{categoriesHead.heading}</h3>
            </div>
        </div>

        <div className="slide py-6">
          <Carousel opts={{ align: "start", }}className="w-full">
            <CarouselContent>
              {randomCategories.map((category: Categories, i: number) => (
                <CarouselItem key={i} className="group basis-1/3 md:basis-1/4 text-center lg:basis-1/6 px-4 md:px-7 transition-all duration-300">
                  <Link href={`/tours/category/${category.slug}`}>
                    <div className="aspect-square rounded-full overflow-hidden relative w-full">
                      <Image alt={category.name} src={category.icon} fill className="object-cover transition-transform duration-300 group-hover:scale-110"/>
                    </div>
                    <h5 className="pt-3 font-semibold text-[13px] md:text-[15px] transition-colors duration-300 group-hover:text-primary">
                      {category.name}
                    </h5>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext className='hidden md:flex' />
          </Carousel>
        </div>
    </div>
  )
}

export default CategoriesSlide