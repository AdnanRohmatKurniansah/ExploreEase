'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion'
import { Label } from '@/app/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group'
import { Slider } from '@/app/components/ui/slider'
import { Categories, Destinations } from '@/app/types/type'
import React from 'react'

type Props = {
  categories: Categories[]
  destinations: Destinations[]
  selectedCategory: string
  setSelectedCategory: (val: string) => void
  selectedDestination: string
  setSelectedDestination: (val: string) => void
  priceRange: number[]
  setPriceRange: (val: number[]) => void
}

const FilterTour = ({
  categories,
  destinations,
  selectedCategory,
  setSelectedCategory,
  selectedDestination,
  setSelectedDestination,
  priceRange,
  setPriceRange,
}: Props) => {
  return (
    <Accordion type="multiple" defaultValue={['category', 'destination', 'price']} className="w-full space-y-2">
      <AccordionItem value="category">
        <AccordionTrigger className="text-sm font-medium">Category</AccordionTrigger>
        <AccordionContent className="pt-2"> 
          <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="cat-all" />
              <Label htmlFor="cat-all">All</Label>
            </div>
            {categories.map((cat, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={cat.slug} id={`cat-${cat.slug}`} />
                <Label htmlFor={`cat-${cat.slug}`}>{cat.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="destination">
        <AccordionTrigger className="text-sm font-medium">Destination</AccordionTrigger>
        <AccordionContent className="pt-2">
          <RadioGroup value={selectedDestination} onValueChange={setSelectedDestination} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="dest-all" />
              <Label htmlFor="dest-all">All</Label>
            </div>
            {destinations.map((dest, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={dest.slug} id={`dest-${dest.slug}`} />
                <Label htmlFor={`dest-${dest.slug}`}>{dest.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="price">
        <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
        <AccordionContent className="pt-4">
          <Slider
            defaultValue={[500000]}
            min={200000}
            max={10000000}
            step={100000}
            value={priceRange}
            onValueChange={setPriceRange}
          />
          <div className="text-sm text-muted-foreground mt-2">
            Selected: Rp {priceRange[0].toLocaleString()} – Rp 10.000.000
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default FilterTour
