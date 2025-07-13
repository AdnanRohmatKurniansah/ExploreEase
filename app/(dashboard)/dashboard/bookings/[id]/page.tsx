import { Button } from '@/app/components/ui/button'
import { ArrowLeftCircle, Mail, MessageCircle, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { notFound } from 'next/navigation'
import prisma from '@/app/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import Image from 'next/image'
import { format } from 'date-fns'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'

interface Params {
  params: Promise<{
    id: string
  }>
}

const Page = async ({ params }: Params) => {
  const { id } = await params

  const booking = await prisma.bookingTransactions.findUnique({
    where: {
        id: id
    },
    include: {
        tour: true
    }
  })

  if (!booking) {
    notFound()
  }

  const subtotal = booking.total_amount
  const discount = 0
  const total = subtotal - discount

  return (
    <div className='main'>
      <div className="flex items-center">
        <div className="flex items-center gap-2 mt-4">
          <Link href={'/dashboard/bookings'}>
            <Button size="sm" className="gap-1 mb-2">
              <ArrowLeftCircle className="h-3.5 w-3.5" />
              <span className="sm:whitespace-nowrap">Back to list page</span>
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle className='text-lg'>Detail booking</CardTitle>
            <CardDescription>See booking details sent from user.</CardDescription>
        </CardHeader>
        <CardContent>
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
                <div className="block md:flex justify-between">
                    <div className="text-sm text-gray-600">
                        <h4 className="font-semibold mb-1">Customer Message</h4>
                        <p>{booking.message || 'No message provided.'}</p>
                    </div>
                    <div className="total">
                        <table className="text-sm w-full md:w-64 mt-6 md:mt-0">
                            <tbody>
                                <tr>
                                    <td className="py-1">Subtotal:</td>
                                    <td className="text-right">Rp {subtotal.toLocaleString('id-ID')}</td>
                                </tr>
                                <tr>
                                    <td className="py-1">Discount:</td>
                                    <td className="text-right">Rp {discount.toLocaleString('id-ID')}</td>
                                </tr>
                                <tr className="font-bold border-t">
                                    <td className="py-2">Total Amount:</td>
                                    <td className="text-right">Rp {total.toLocaleString('id-ID')}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page