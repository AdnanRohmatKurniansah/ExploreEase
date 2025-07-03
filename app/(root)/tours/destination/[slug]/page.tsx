import prisma from '@/app/lib/prisma'
import ClientTourPage from '../../_components/ClientTourPage'

type Props = {
  params: Promise<{
    slug: string
  }>
}

const Page = async ({ params }: Props) => {
  const { slug } = await params

  const categories = await prisma.categories.findMany()
  const destinations = await prisma.destinations.findMany()

  return (
    <ClientTourPage
      categories={categories}
      destinations={destinations}
      initialDestinationSlug={slug}
    />
  )
}

export default Page
