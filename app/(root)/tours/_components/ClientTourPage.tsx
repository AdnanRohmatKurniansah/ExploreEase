'use client'

import React, { useState } from 'react'
import FilterTour from '../_components/FilterTour'
import TourCard from '@/app/(root)/_components/tour-card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/app/components/ui/breadcumb'
import { Categories, Destinations, Tours } from '@/app/types/type'
import TourCardSkeleton from '../../_components/tour-card-skeleton'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Props = {
  categories: Categories[]
  destinations: Destinations[]
  initialCategorySlug?: string
  initialDestinationSlug?: string
}

const ClientTourPage = ({
  categories,
  destinations,
  initialCategorySlug,
  initialDestinationSlug,
}: Props) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategorySlug || 'all')
  const [selectedDestination, setSelectedDestination] = useState(initialDestinationSlug || 'all')
  const [priceRange, setPriceRange] = useState([500000])
  const [page, setPage] = useState(1)
  const limit = 12

  const fetchTours = async () => {
    const res = await axios.get('/api/tours/filter', {
      params: {
        category: selectedCategory,
        destination: selectedDestination,
        price: priceRange[0],
        page,
        limit,
      },
    })
    return res.data
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tours', selectedCategory, selectedDestination, priceRange[0], page],
    queryFn: () =>
      axios.get('/api/tours/filter', {
          params: {
          category: selectedCategory,
          destination: selectedDestination,
          price: priceRange[0],
          page,
          limit,
        },
      }).then(res => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  })

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
              <BreadcrumbLink>Tours</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="main grid grid-cols-1 md:grid-cols-4 gap-6 px-5 md:px-15 py-8 section-page sm">
        <div className="md:col-span-1 border rounded-xl bg-white p-4 shadow">
          <h2 className="font-semibold text-lg pb-4 border-b">Filters</h2>
          <FilterTour
            categories={categories}
            destinations={destinations}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedDestination={selectedDestination}
            setSelectedDestination={setSelectedDestination}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </div>

        <div className="md:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <TourCardSkeleton key={i} />
              ))}
            </div>
          ) : isError || !data?.tours ? (
            <div className="text-center text-red-600">Failed to fetch tours.</div>
          ) : data.tours.length === 0 ? (
            <div className="not-found flex flex-col items-center justify-center h-2/3 text-center">
              <div className="w-[150px] md:w-[240px] aspect-square relative mb-4">
                <Image src="/images/not-found.png" fill alt="not found img" className="object-contain" />
              </div>
              <p className="font-medium">No tours found with the selected filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.tours.map((tour: Tours, i: number) => (
                  <TourCard key={i} tour={tour} />
                ))}
              </div>

              {data.total > limit && (
                <div className="mt-8 flex justify-center gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 font-medium">
                    Page {page} of {Math.ceil(data.total / limit)}
                  </span>
                  <button
                    onClick={() => setPage((p) => (p < Math.ceil(data.total / limit) ? p + 1 : p))}
                    disabled={page >= Math.ceil(data.total / limit)}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClientTourPage
