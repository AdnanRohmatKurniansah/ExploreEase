import prisma from '@/app/lib/prisma'
import React, { Suspense } from 'react'
import ClientTourPage from './_components/ClientTourPage'

const Page = async () => {
  const categories = await prisma.categories.findMany()
  const destinations = await prisma.destinations.findMany()

  return (
    <Suspense>
      <ClientTourPage categories={categories} destinations={destinations} />
    </Suspense> 
  )
}

export default Page
