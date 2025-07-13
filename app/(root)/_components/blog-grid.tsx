'use client'

import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { ArrowRight, ArrowRightCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const articles = [
  {
    slug: '#',
    title: 'Exploring the Hidden Paradise in Bali’s Eastern Coastline',
    image: '/images/blog/blog-1.jpg',
    date: { day: '15', month: 'Jul' },
    author: {
      name: 'Admin',
      avatar: '/images/user.png',
    },
  },
  {
    slug: '#',
    title: 'Culinary Journey Through Yogyakarta’s Traditional Markets',
    image: '/images/blog/blog-2.jpg',
    date: { day: '28', month: 'Jun' },
    author: {
      name: 'Admin',
      avatar: '/images/user.png',
    },
  },
  {
    slug: '#',
    title: 'Ultimate Guide to Sunrise Hiking at Mount Bromo, East Java',
    image: '/images/blog/blog-3.jpg',
    date: { day: '07', month: 'May' },
    author: {
      name: 'Admin',
      avatar: '/images/user.png',
    },
  },
  {
    slug: '#',
    title: 'Diving into the Crystal Waters of Raja Ampat: What You Need to Know',
    image: '/images/blog/blog-4.jpg',
    date: { day: '02', month: 'Apr' },
    author: {
      name: 'Admin',
      avatar: '/images/user.png',
    },
  },
]

const BlogGrid = () => {
  return (
    <div className="relative w-full px-5 md:px-15 section-page">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="section-title relative mb-6">
          <div className="absolute -top-2 -left-5">
            <div className="relative w-[80px] md:w-[130px] h-auto aspect-square opacity-30">
              <Image src="/images/ornaments/bag-ornament.png" alt="Bag Ornament" fill className="object-contain"/>
            </div>
          </div>
          <div className="title flex justify-start items-center mb-3 md:mb-4">
            <span></span>
            <h6 className="font-semibold text-gray-700">Latest Article</h6>
          </div>
          <div className="heading">
            <h3 className="font-bold">Travel Updates & Inspiration</h3>
          </div>
        </div>
        <div className="view-all hidden justify-end md:flex">
          <Button className="px-5 py-4">
            <Link className="flex items-center" href="#">
              View All <ArrowRightCircle className="w-5 ms-2" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
        {articles.map((article, i) => (
          <Link key={i} href={article.slug} className="group block">
            <Card className="overflow-hidden gap-0 p-0 hover:shadow-md transition-shadow h-full">
              <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden">
                <Image alt={article.title} src={article.image} fill className="object-cover transition-transform duration-300 group-hover:scale-105"/>
                <div className="absolute left-5 top-5 z-10">
                  <Button className="w-12 h-12 bg-white p-0 hover:bg-white rounded-full text-black text-xs leading-tight flex flex-col items-center justify-center">
                    <span>{article.date.day}</span>
                    <span className="text-[10px]">{article.date.month}</span>
                  </Button>
                </div>
              </div>

              <div className="content p-3">
                <h4 className="font-semibold text-md line-clamp-2">{article.title}</h4>
                <div className="footer grid grid-cols-2 mt-4 items-center">
                  <div className="author flex items-center gap-2">
                    <Image src={article.author.avatar} alt={article.author.name} width={28} height={28} className="rounded-full" />
                    <span className="text-sm text-muted-foreground">{article.author.name}</span>
                  </div>
                  <div className="detail flex justify-end">
                    <div className="bg-primary flex items-center text-white w-9 h-9 rounded-full hover:scale-105 transition-transform">
                      <ArrowRight className="mx-auto w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex md:hidden justify-center mt-10">
        <Button className="px-5 py-4">
          <Link className="flex items-center" href="#">
            View All <ArrowRightCircle className="w-5 ms-2" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default BlogGrid
