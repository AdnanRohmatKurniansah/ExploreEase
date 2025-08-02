'use client'

import React, { useEffect, useState } from 'react'
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
import { useSearchParams, useRouter } from 'next/navigation'
import { useDebounce } from '@/app/hooks/useDebounce'

type Props = {
  categories: Categories[]
  destinations: Destinations[]
  initialDestinationSlug?: string
  initialCategorySlug?: string
}

const ClientTourPage = ({ categories, destinations, initialDestinationSlug, initialCategorySlug }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [selectedCategory, setSelectedCategory] = useState(
    initialCategorySlug || searchParams.get('category') || 'all')
  const [selectedDestination, setSelectedDestination] = useState(
    initialDestinationSlug || searchParams.get('destination') || 'all'
  )
  const [priceRange, setPriceRange] = useState([parseInt(searchParams.get('price') || '500000', 10)])
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10))
  const search = searchParams.get('search') || ''
  const limit = 12

  const debouncedCategory = useDebounce(selectedCategory)
  const debouncedDestination = useDebounce(selectedDestination)
  const debouncedPrice = useDebounce(priceRange)

  useEffect(() => {
    const params = new URLSearchParams()

    if (debouncedPrice[0] > 0) params.set('price', String(debouncedPrice[0]))
    if (page > 1) params.set('page', String(page))
    if (search) params.set('search', search)

    let path = '/tours'

    if (initialDestinationSlug || (debouncedDestination !== 'all' && debouncedDestination !== selectedDestination)) {
      path = `/tours/destination/${debouncedDestination}`
      if (debouncedCategory !== 'all') params.set('category', debouncedCategory)
    } else if (initialCategorySlug || (debouncedCategory !== 'all' && debouncedCategory !== selectedCategory)) {
      path = `/tours/category/${debouncedCategory}`
      if (debouncedDestination !== 'all') params.set('destination', debouncedDestination)
    } else {
      if (debouncedCategory !== 'all') params.set('category', debouncedCategory)
      if (debouncedDestination !== 'all') params.set('destination', debouncedDestination)
    }

    const queryString = params.toString()
    router.replace(`${path}${queryString ? `?${queryString}` : ''}`)
  }, [
    debouncedCategory,
    debouncedDestination,
    debouncedPrice,
    page,
    search,
  ])

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tours', debouncedCategory, debouncedDestination, debouncedPrice[0], page, search],
    queryFn: () =>
      axios.get('/api/tours/filter', {
        params: {
          category: debouncedCategory,
          destination: debouncedDestination,
          price: debouncedPrice[0],
          page,
          limit,
          search: search.trim() || undefined,
        },
      }).then(res => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  })

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
            setSelectedCategory={(val) => {
              setPage(1)
              setSelectedCategory(val)
            }}
            selectedDestination={selectedDestination}
            setSelectedDestination={(val) => {
              setPage(1)
              setSelectedDestination(val)
            }}
            priceRange={priceRange}
            setPriceRange={(val) => {
              setPage(1)
              setPriceRange(val)
            }}
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
            <div className="not-found flex flex-col items-center justify-center h-2/3 mt-10 md:mt-0 text-center">
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
