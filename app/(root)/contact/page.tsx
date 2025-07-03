import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/app/components/ui/breadcumb'
import { Mail, Map, Phone } from 'lucide-react'
import React from 'react'
import ContactForm from './contact-form'

const Page = () => {
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
              <BreadcrumbLink>Contact</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="main grid grid-cols-1 md:grid-cols-2 gap-6 px-5 md:px-15 py-8 section-page sm">
        <div className="contact-text">
          <h2 className="font-bold text-2xl mb-4">Connect with Our Friendly Support Team</h2>
          <p className='font-semibold mb-2'>We’re here to help — your comfort and convenience are our mission.</p>
          <p className='text-gray-700'>Have questions or need assistance? Our dedicated team is always ready to offer fast, reliable support. Don’t hesitate to reach out — we’re just one message away.</p>

          <ul className='inform mt-8'>
            <li className='flex gap-4 pb-4 mb-4 border-b'>
              <div className="icon p-2 w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-full bg-primary text-white"><Mail /></div>
              <div className="label">
                <p className='text-gray-700 text-sm font-medium'>Email Address</p>
                <p className='font-semibold'>example@gmail.com</p>
              </div>
            </li>
            <li className='flex gap-4 pb-4 mb-4 border-b'>
              <div className="icon p-2 w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-full bg-primary text-white"><Phone /></div>
              <div className="label">
                <p className='text-gray-700 text-sm font-medium'>Phone Number</p>
                <p className='font-semibold'>+62 85899999</p>
              </div>
            </li>
            <li className='flex gap-4 pb-4 mb-4 border-b'>
              <div className="icon p-2 w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-full bg-primary text-white"><Map /></div>
              <div className="label">
                <p className='text-gray-700 text-sm font-medium'>Our Location</p>
                <p className='font-semibold'>Yogyakarta, Indonesia</p>
              </div>
            </li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </div>
  )
}

export default Page
