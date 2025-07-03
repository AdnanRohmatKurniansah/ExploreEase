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
import axios from 'axios'

type Props = {
  categories: Categories[]
  destinations: Destinations[]
}

const ClientTourPage = ({ categories, destinations }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDestination, setSelectedDestination] = useState('all')
  const [priceRange, setPriceRange] = useState([500000])
  const [tours, setTours] = useState<Tours[]>([])
  const [loading, setLoading] = useState(false)

  const fetchFilteredTours = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/tours/search', {
        params: {
          category: selectedCategory,
          destination: selectedDestination,
          price: priceRange[0],
        },
      })
      setTours(res.data)
    } catch (error) {
      console.error('Failed to fetch tours:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFilteredTours()
  }, [selectedCategory, selectedDestination, priceRange])

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
          <h2 className="font-semibold text-lg mb-4">Filters</h2>
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
          {loading ? (
            <p>Loading tours...</p>
          ) : tours.length === 0 ? (
            <p>No tours found with the selected filters.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour, i) => (
                <TourCard key={i} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClientTourPage
