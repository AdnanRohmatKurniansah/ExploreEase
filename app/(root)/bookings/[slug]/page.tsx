import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator } from '@/app/components/ui/breadcumb'
import { Card } from '@/app/components/ui/card'
import prisma from '@/app/lib/prisma'
import { format } from 'date-fns'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import { Button } from '@/app/components/ui/button'
import Link from 'next/link'
import PayTour from './_components/pay-tour'


type Props = {
  params: Promise<{
    id: string
  }>
}

const BookingDetailPage = async ({ params }: Props) => {
  const { id } = await params

  const booking = await prisma.bookingTransactions.findFirst({
    where: { id },
    include: { 
      tour: true 
    }
  })

  if (!booking) return notFound()

  const subtotal = booking.total_amount
  const discount = 0
  const total = subtotal - discount

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
              <BreadcrumbLink>Booking Detail</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="main px-5 md:px-15 py-8 section-page sm">
        <div className="max-w-3xl mx-auto">
          <Card className="px-6 py-6 md:px-10 md:py-5">
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <div className='logo'>
                  <Image src={'/images/logo.png'} width={0} height={0} sizes="100vw" className="h-14 md:h-16 w-auto" alt={'logo'} />
                </div>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p><strong>Invoice No:</strong> #{booking.id.slice(0, 6).toUpperCase()}</p>
                <p><strong>Created At:</strong> {format(booking.created_at, 'dd MMM yyyy')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Customer Details</h3>
                <p>Name: {booking.name}</p>
                <p>Email: {booking.email}</p>
                <p>Phone: {booking.phone_number}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Issued By</h3>
                <p>ExploreEase Travel</p>
                <p>Email: exploreease@example.com</p>
              </div>
            </div>

            <h3 className="text-base font-semibold mb-1">Booking Summary</h3>
            <div className="overflow-x-auto mb-3 md:mb-6">
              <Table className="min-w-[600px] text-sm border">
                <TableHeader className="bg-gray-50 ">
                  <TableRow>
                    <TableHead className="text-left border px-3 py-2">Description</TableHead>
                    <TableHead className="text-center border px-3 py-2">Participants</TableHead>
                    <TableHead className="text-right border px-3 py-2">Price</TableHead>
                    <TableHead className="text-right border px-3 py-2">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="border px-3 py-2">{booking.tour.title}</TableCell>
                    <TableCell className="text-center border px-3 py-2">{booking.total_participant}</TableCell>
                    <TableCell className="text-right border px-3 py-2">
                      Rp {(
                        booking.tour.discount_price !== null && booking.tour.discount_price !== 0
                          ? booking.tour.discount_price
                          : booking.tour.price
                      ).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right border px-3 py-2">
                      Rp {booking.total_amount.toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <PayTour booking={booking} subtotal={subtotal} discount={discount} total={total} />
            <div className="mt-4 text-xs text-gray-500 text-center border-t pt-4">
                <p>Thank you for booking with ExploreEase.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BookingDetailPage
