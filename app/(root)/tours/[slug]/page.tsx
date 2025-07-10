import { notFound } from 'next/navigation'
import prisma from '@/app/lib/prisma'
import TourGallery from './_components/TourGallery'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/app/components/ui/breadcumb'
import { Map, MapPin, Plane, Star, Check } from 'lucide-react'
import Link from 'next/link'
import TourActions from './_components/TourActions'
import Image from 'next/image'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/app/components/ui/carousel'
import { Tours } from '@/app/types/type'
import TourCard from '../../_components/tour-card'
import { Label } from '@radix-ui/react-dropdown-menu'
import { Input } from '@/app/components/ui/input'
import TourSidebar from './_components/TourSidebar'

type Props = {
  params: Promise<{
    slug: string
  }>
}

const Page = async ({ params }: Props) => {
  const { slug } = await params

  const tour = await prisma.tours.findFirst({
    where: { slug },
    include: {
      category: true,
      destination: true,
    }
  })

  if (!tour) notFound()

  const tourImages = await prisma.toursImage.findMany({
    where: { 
      tourId: tour.id 
    },
    orderBy: { 
      created_at: 'desc' 
    }
  })

  const includeIds = JSON.parse(tour.include || '[]') as string[]
  const excludeIds = JSON.parse(tour.exclude || '[]') as string[]

  const includes = await prisma.facility.findMany({
    where: {
      id: {
        in: includeIds,
      },
      type: 'include'
    },
    orderBy: {
      title: 'asc',
    }
  })

  const excludes = await prisma.facility.findMany({
    where: {
      id: {
        in: excludeIds,
      },
      type: 'exclude'
    },
    orderBy: {
      title: 'asc',
    }
  })

  const tourItinerary = await prisma.toursItinerary.findMany({
    where: { 
      tourId: tour.id 
    },
    orderBy: { 
      created_at: 'asc' 
    }
  })

  const otherTours = await prisma.tours.findMany({
    where: {
      NOT: {
        id: tour.id
      }
    },
    include: {
      category: true,
      destination: true,
    }
  })

  return (
    <div className="relative w-full">
      <div className="bg-primary-transparent border-b text-black h-10 px-5 md:px-15 flex items-center">
        <Breadcrumb>
          <BreadcrumbList className="text-gray-700">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/tours">Tours</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{tour.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-5 md:px-15 section-page">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold flex items-center mb-2">
              {tour.title}
              {tour.is_popular && (
                <span className="bg-primary ms-2 flex rounded-xl items-center text-white text-[10px] px-2 py-0">
                  <Star className="w-3 me-1" /> Popular
                </span>
              )}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="text-sm col-span-2 text-gray-600 mb-2 md:mb-4 flex gap-5 flex-wrap">
              <Link className="flex items-center" href={`/tours/category/${tour.category.slug}`}>
                <Map className="w-4 me-2 text-primary" /> {tour.category?.name}
              </Link>
              <Link className="flex items-center" href={`/tours/destination/${tour.destination.slug}`}>
                <Plane className="w-4 me-2 text-primary" /> {tour.destination?.name}
              </Link>
              <span className="flex items-center">
                <MapPin className="w-4 me-2 text-primary" /> {tour.location}
              </span>
            </div>
            <TourActions tourId={tour.id}/>
          </div>

          <TourGallery tour={tour} tourImages={tourImages} />
          <div className="description py-6 border-b">
            <h4 className='text-2xl font-semibold mb-3'>Description</h4>
            <div className="content text-[15px] text-gray-700" dangerouslySetInnerHTML={{ __html: tour.description }} />
          </div>
          <div className="highlight py-6 border-b">
            <h4 className='text-2xl font-semibold mb-3'>Highlight</h4>
            <div className="content text-[15px] text-gray-700" dangerouslySetInnerHTML={{ __html: tour.highlight }} />
          </div>
          <div className="facility py-6 border-b">
            <h4 className='text-2xl font-semibold mb-5'>Facilities</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="include">
                {includes.map((include, i) => (
                  <li key={i} className='flex mb-4'>
                    <div className="icon me-3 bg-green-600 rounded-full p-1 w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <Check className="text-white w-5 h-5" />
                    </div>
                    <div className="text-[15px] text-gray-700">
                      <p>{include.title}</p>
                    </div>
                  </li>
                ))}
              </div>
              {excludes.length != 0 && (
              <div className="exclude">
                {excludes.map((exclude, i) => (
                  <li key={i} className='flex mb-4'>
                    <div className="icon me-3 bg-red-600 rounded-full p-1 w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <Check className="text-white w-5 h-5" />
                    </div>
                    <div className="text-[15px] text-gray-700">
                      <p>{exclude.title}</p>
                    </div>
                  </li>
                ))}
              </div>
              )}
            </div>
          </div>
          <div className="itinerary py-6 border-b">
            <h4 className='text-2xl font-semibold mb-6'>Itineraries</h4>
            <div className="itinerary">
              {tourItinerary.map((itinerary, i) => (
                <li key={i} className="flex mb-4 relative">
                  <div className={`icon me-3 bg-primary text-white rounded p-3 w-7 h-7 flex items-center justify-center flex-shrink-0 relative after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:w-px after:h-[40px] after:border-l after:border-dashed after:border-gray-500 ${i === tourItinerary.length - 1 ? 'after:hidden' : ''}`}>
                    {i + 1}
                  </div>
                  <div className="content">
                    <h3 className="font-semibold">{itinerary.title}</h3>
                    <p className="text-[15px] text-gray-700">{itinerary.description}</p>
                  </div>
                </li>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar relative md:sticky md:top-24 h-fit">
          <TourSidebar tour={tour} />
        </div>
      </div>
      
      {otherTours.length != 0 && (
      <div className='relative w-full px-5 md:px-15 pb-40'>
        <div className="section-title relative">
            <div className="absolute -top-2 -left-5">
              <div className="relative w-[80px] md:w-[130px] h-auto aspect-square opacity-30">
                <Image src="/images/ornaments/bag-ornament.png" alt="bag ornament" fill className="object-contain"/>
              </div>
            </div>
            <div className="title flex justify-start items-center mb-3 md:mb-4">
                <span></span>
                <h6 className='font-semibold text-gray-700'>Other Tours</h6>
            </div>
            <div className="heading">
                <h3 className='font-bold'>You might also like...</h3>
            </div>
        </div>

        <div className="slide py-6">
          <Carousel opts={{ align: "start", }}className="w-full">
            <CarouselContent>
              {otherTours.map((otherTour: Tours, i: number) => (
                <CarouselItem key={i} className="group basis-1/1 md:basis-1/4 transition-all duration-300">
                  <TourCard tour={otherTour} key={i} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext className='hidden md:flex' />
          </Carousel>
        </div>
      </div>
      )}
    </div>
  )
}

export default Page
