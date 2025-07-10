'use client'

import { Button } from '@/app/components/ui/button'
import { Heart, Share2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {
    tourId: string
}

const TourActions = ({ tourId }: Props) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
      setIsWishlisted(wishlist.includes(tourId))
  }, [tourId])

  const AddWishList = () => {
    const wishlist: string[] = JSON.parse(localStorage.getItem('wishlist') || '[]')
  
    let updatedWishlist: string[]
  
    if (wishlist.includes(tourId)) {
      updatedWishlist = wishlist.filter((id) => id !== tourId)
      toast.success('Removed from wishlist')
      setIsWishlisted(false)
    } else {
      updatedWishlist = [...wishlist, tourId]
      toast.success('Added to wishlist')
      setIsWishlisted(true)
    }
  
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
  }

  const CopyUrl = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
        toast.success('URL successfully copied to clipboard!')
    }).catch(() => {
        toast.error('Failed to copy URL.')
    })
  }

  return (
    <div className="flex gap-2 shrink-0 mb-4 justify-start md:justify-end">
        <Button variant="outline" size="sm" onClick={CopyUrl}>
            <Share2 className="w-4 h-4 mr-1" /> Share
        </Button>
        <Button variant="outline" size="sm" onClick={AddWishList}>
            <Heart className={`w-4 h-4 transition mr-1 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-black'}`} /> Wishlist
        </Button>
    </div>
  )
}

export default TourActions