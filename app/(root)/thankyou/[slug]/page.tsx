import { notFound } from 'next/navigation'
import prisma from '@/app/lib/prisma'
import ThankYouClient from './_components/thankyou-client'

type Props = {
  searchParams: Promise<{
    order_id: string
    transaction_status: string
  }>
}

const Page = async ({ searchParams }: Props) => {
  const { order_id, transaction_status } = await searchParams

  if (!order_id) return notFound()

  const booking = await prisma.bookingTransactions.findFirst({
    where: {
      order_id,
    },
  })

  if (!booking) return notFound()

  return (
    <ThankYouClient
      booking={{
        id: booking.id,
        name: booking.name,
        total_amount: booking.total_amount,
      }}
      transactionStatus={transaction_status}
    />
  )
}

export default Page
