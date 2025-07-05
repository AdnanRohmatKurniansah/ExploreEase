import React from 'react';
import HeroCarousel from './_components/hero-carousel';
import CategoriesSlide from './_components/categories-slide';
import AboutSection from './_components/about';
import TourGrid from './_components/tour-grid';
import DestinationGrid from './_components/destinations-grid';
import BlogGrid from './_components/blog-grid';
import prisma from '../lib/prisma';

const Page = async () => {
  const categories = await prisma.categories.findMany()
  const destinations = await prisma.destinations.findMany()

  return (
    <div className='main'>
      <section className='hero-carousel'>
        <HeroCarousel categories={categories} destinations={destinations} />
      </section>
      <section className='categories-slide'>
        <CategoriesSlide />
      </section>
      <section className='about-section'>
        <AboutSection />
      </section>
      <section className='tour-section'>
        <TourGrid />
      </section>
      <section className='destination-section'>
        <DestinationGrid />
      </section>
      <section className='blog-section'>
        <BlogGrid />
      </section>
    </div>
  );
};

export default Page;
