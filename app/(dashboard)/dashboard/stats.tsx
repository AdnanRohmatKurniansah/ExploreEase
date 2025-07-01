import React from 'react'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card'
import { ArrowRight, Badge, BookIcon, Plane, Ticket, User } from 'lucide-react'
import prisma from '@/app/lib/prisma'

const Stats = async () => {
  const users = await prisma.user.count()
  const destinations = await prisma.destinations.count()
  const tours = await prisma.tours.count()
  const bookings = await prisma.bookingTransactions.count()

  return (
    <Card>
        <CardHeader>
            <CardTitle className='text-lg'>Dashboard Management</CardTitle>
            <CardDescription>
                Easily monitor and control all essential data and activities from one place.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>User</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {users}
                </CardTitle>
                <CardAction>
                  <div className='p-1 border-2 border-primary rounded-full'>
                    <User/>
                  </div>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  The number of all users <ArrowRight className="size-4" />
                </div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Destinations</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {destinations}
                </CardTitle>
                <CardAction>
                  <div className='p-1 border-2 border-primary rounded-full'>
                    <Plane />
                  </div>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  The number of all destinations <ArrowRight className="size-4" />
                </div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Tickets</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {tours}
                </CardTitle>
                <CardAction>
                  <div className='p-1 border-2 border-primary rounded-full'>
                    <Ticket/>
                  </div>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  The number of all tours <ArrowRight className="size-4" />
                </div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Booking Transactions</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {bookings}
                </CardTitle>
                <CardAction>
                  <div className='p-1 border-2 border-primary rounded-full'>
                    <BookIcon />
                  </div>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Total number of new order <ArrowRight className="size-4" />
                </div>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
    </Card>
  )
}

export default Stats