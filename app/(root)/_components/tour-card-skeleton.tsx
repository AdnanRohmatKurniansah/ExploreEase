'use client'

import React from 'react'
import { Card } from '@/app/components/ui/card'
import { Skeleton } from '@/app/components/ui/skeleton'

const TourCardSkeleton = () => {
  return (
    <Card className="overflow-hidden gap-0 p-3">
      <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden">
        <Skeleton className="absolute w-full h-full" />
      </div>

      <div className="mt-3 space-y-2">
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" /> 
        <Skeleton className="h-5 w-2/3 rounded" /> 
      </div>
    </Card>
  )
}

export default TourCardSkeleton
