'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/app/components/ui/breadcumb'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Tours } from '@/app/types/type'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import WishlistCard from './_components/wishlist-card'
import WishlistCardSkeleton from './_components/wishlist-card-skeleton'
import { Button } from '@/app/components/ui/button'
import Link from 'next/link'
import { ArrowRightCircle } from 'lucide-react'

const WishlistPage = () => {
  const [wishlistIds, setWishlistIds] = useState<string[] | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('wishlist')
    if (raw) {
      try {
        const parsed: string[] = JSON.parse(raw)
        setWishlistIds(parsed)
      } catch (e) {
        console.error('Invalid wishlist data:', e)
        setWishlistIds([])
      }
    } else {
      setWishlistIds([])
    }
  }, [])

  const { data: tours = [], isLoading } = useQuery<Tours[]>({
    queryKey: ['toursWishlist'],
    queryFn: () =>
      axios.get('/api/tours').then(res => res.data.data),
    staleTime: 60 * 1000,
    retry: 3,
  })

  const wishlistTours = wishlistIds ? tours.filter((tour) => wishlistIds.includes(tour.id)) : []

  const handleRemove = (id: string) => {
    setWishlistIds((prev) => (prev ? prev.filter((wid) => wid !== id) : []))
  }


  return (
    <div className="relative w-full">
      <div className="breadcumb bg-primary-transparent border-b text-black h-10 px-5 md:px-15 flex items-center">
        <Breadcrumb>
          <BreadcrumbList className="text-gray-700">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Wishlist</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="main px-5 md:px-15 py-8 section-page sm">
        {wishlistTours.length != 0 && (
        <div className="section-title relative mb-2">
          <div className="absolute -top-2 -left-5">
            <div className="relative w-[80px] md:w-[130px] h-auto aspect-square opacity-30">
              <Image src="/images/ornaments/bag-ornament.png" alt="bag ornament" fill className="object-contain"/>
            </div>
          </div>
          <div className="title flex justify-start items-center mb-3 md:mb-4">
            <span></span>
            <h6 className="font-semibold text-gray-700">Wishlist</h6>
          </div>
          <div className="heading">
            <h3 className="font-bold">Your Favorite Destinations Await</h3>
          </div>
        </div>
        )}

        <div className="main">
          {isLoading || wishlistIds === null ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <WishlistCardSkeleton key={i} />
              ))}
            </div>
          ) : wishlistTours.length === 0 ? (
            <div className="not-found flex flex-col items-center justify-center h-[400px] text-center">
              <div className="w-[150px] md:w-[240px] aspect-square relative mb-1">
                <Image src="/images/not-found.png" fill alt="not found img" className="object-contain" />
              </div>
              <p className="font-medium text-lg">Your wishlist is empty</p>
              <Button asChild className="mt-5 bg-primary text-sm md:text-md px-4 py-3 rounded-full w-fit">
                <Link href="/tours">Explore Tours <ArrowRightCircle className='w-5 ms-2' /></Link>
              </Button>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-6">
                {wishlistTours.map((tour) => (
                  <WishlistCard key={tour.id} tour={tour} onRemove={handleRemove} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WishlistPage
