import prisma from '@/app/lib/prisma'
import React from 'react'
import ClientTourPage from './_components/ClientTourPage'

const Page = async () => {
  const categories = await prisma.categories.findMany()
  const destinations = await prisma.destinations.findMany()

  return (
    <ClientTourPage categories={categories} destinations={destinations} />
  )
}

export default Page
