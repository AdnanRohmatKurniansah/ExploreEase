import { notFound } from 'next/navigation'
import prisma from '@/app/lib/prisma'
import ThankYouClient from './_components/thankyou-client'

type Props = {
  params: Promise<{
    order_id: string
  }>
}

const Page = async ({ params }: Props) => {
  const { order_id } = await params

  const booking = await prisma.bookingTransactions.findUnique({
    where: {
      order_id,
    },
  })

  if (!booking) return notFound()

  return (
    <ThankYouClient
      booking={booking}
    />
  )
}

export default Page
