'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { ArrowRightCircle } from 'lucide-react';

const slides = [
  {
    title: 'Discover the Wonders of the World with Exploreease',
    subtitle: 'Find your dream destination and enjoy unforgettable travel experiences with our curated tour packages.',
    cta: 'Explore Tours',
    img: '/images/banner/banner-1.png',
  },
  {
    title: 'Discover the Wonders of the World with Exploreease',
    subtitle: 'Find your dream destination and enjoy unforgettable travel experiences with our curated tour packages.',
    cta: 'Explore Tours',
    img: '/images/banner/banner-2.png',
  },
  {
    title: 'Discover the Wonders of the World with Exploreease',
    subtitle: 'Find your dream destination and enjoy unforgettable travel experiences with our curated tour packages.',
    cta: 'Explore Tours',
    img: '/images/banner/banner-3.png'
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[85vh] bg-white rounded-b-3xl">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000 ease-in-out flex flex-col md:flex-row px-6 md:px-20 py-10',
            idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          )}
          style={{
            backgroundImage: `url(${slide.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/40 z-0" />

          <div className="z-10 flex-1 flex flex-col justify-center text-white">
            <h2 className="text-[27px] md:text-[40px] font-bold w-full md:w-4/5 leading-snug">
              {slide.title}
            </h2>
            <p className="mt-4 text-md">{slide.subtitle}</p>
            <Button asChild className="mt-6 bg-primary text-sm md:text-md px-4 py-3 rounded-full w-fit">
              <Link href="/tours">{slide.cta} <ArrowRightCircle className='w-5 ms-2' /></Link>
            </Button>
          </div>

          <div className="z-10 flex-col gap-4 justify-center ml-auto hidden md:flex">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  'rounded-2xl overflow-hidden shadow-lg w-[200px] h-[110px] border-1 transition-transform hover:scale-[1.03]'
                )}
              >
                <Image width={0} height={0} sizes="100vw" src={s.img} alt={`thumb-${i}`} className="h-full object-cover w-auto" />
              </button>
            ))}
          </div>
        </div>
      ))}


      <div className="absolute -bottom-50 md:-bottom-8 w-[90%] left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl z-30 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
          <div className="flex-1">
            <Label className="block text-sm font-semibold mb-1">Where</Label>
            <Input type="text" className="w-full border px-4 py-2 rounded-md" placeholder="Destinations" />
          </div>
          <div className="flex-1">
            <Label className="block text-sm font-semibold mb-1">Type</Label>
            <Input type="text" className="w-full border px-4 py-2 rounded-md" placeholder="Categories" />
          </div>
          <Button className="bg-primary px-5 py-4 text-md rounded-md">
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
