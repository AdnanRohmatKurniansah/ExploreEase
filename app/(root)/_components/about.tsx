import { Button } from '@/app/components/ui/button'
import { ArrowRightCircle, CreditCard, MapIcon, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const AboutSection = () => {
  const aboutHead = {
    title: "About ExploreEase",
    heading: "Your Next Journey Starts Here",
    desc: "Welcome to ExploreEase — your gateway to discovering Indonesia’s top destinations through curated, hassle-free travel experiences. From Borobudur to Raja Ampat, adventure starts here.",
  }

  return (
    <div className='relative w-full px-5 md:px-15 section-page bg-[#F3F6F9]'>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 md:gap-20">
            <div className="about-image text-center mx-auto mt-4 md:mt-0 order-2 md:order-1 col-span-2 w-full aspect-square overflow-hidden relative mb-8">
                <Image alt={'about img'} src={'/images/about/about-img.png'} fill className="w-full"/>
            </div>
            <div className="about-text order-1 md:order-2 col-span-3">
                <div className="section-title relative mb-2">
                    <div className="absolute -top-2 -left-5">
                        <div className="relative w-[80px] md:w-[130px] h-auto aspect-square opacity-30">
                            <Image src="/images/ornaments/map-ornament.png" alt="map ornament" fill className="object-contain"/>
                        </div>
                    </div>
                    <div className="title flex justify-start items-center mb-3 md:mb-4">
                        <span></span>
                        <h6 className='font-semibold text-gray-700'>{aboutHead.title}</h6>
                    </div>
                    <div className="heading">
                        <h3 className='font-bold'>{aboutHead.heading}</h3>
                    </div>
                </div>
                <div className="desc mb-4">
                    <p>{aboutHead.desc}</p>
                </div>
                <ul className='why-choose-us mb-8'>
                    <li className='flex mb-4'>
                        <div className="icon me-3 bg-primary rounded-full p-3 w-12 h-12 flex items-center justify-center flex-shrink-0">
                            <MapIcon className="text-white w-5 h-5" />
                        </div>
                        <div className="text">
                            <h3 className='font-semibold'>Curated Tours</h3>
                            <p>Handpicked experiences tailored for every traveler.</p>
                        </div>
                    </li>
                    <li className='flex mb-4'>
                        <div className="icon me-3 bg-primary rounded-full p-3 w-12 h-12 flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className='text-white' />
                        </div>
                        <div className="text">
                            <h3 className='font-semibold'>Trusted Local Guides</h3>
                            <p>Explore with certified and knowledgeable guides.</p>
                        </div>
                    </li>
                    <li className='flex mb-4'>
                        <div className="icon me-3 bg-primary rounded-full p-3 w-12 h-12 flex items-center justify-center flex-shrink-0">
                            <CreditCard className='text-white' />
                        </div>
                        <div className="text">
                            <h3 className='font-semibold'>Secure Booking</h3>
                            <p>Safe payments and instant confirmations.</p>
                        </div>
                    </li>
                </ul>
                <Button asChild className="bg-white hover:bg-secondary hover:text-white text-black border border-secondary text-sm md:text-md px-5 py-4 rounded-full w-fit">
                    <Link href="/tours">Learn More <ArrowRightCircle className='w-5 ms-2' /></Link>
                </Button>
            </div>
        </div>
    </div>
  )
}

export default AboutSection