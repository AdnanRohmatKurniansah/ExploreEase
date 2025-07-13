'use client'

import { Button } from '@/app/components/ui/button'
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import TableSkeleton from '@/app/components/shared/table-skeleton'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { ToursItinerary } from '@/app/types/type'
import { formatDate } from '@/app/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu'
import Pagination from '@/app/components/shared/pagination'
import DeleteConfirmationDialog from '@/app/components/shared/delete-modal'

const TourItineraryTable = ({ tourId }: {tourId: string}) => {
  const useTourItinerary = (page: number, limit: number) => useQuery({
    queryKey: ['toursItinerary', page],
    queryFn: () =>
      axios.get(`/api/tours/itinerary?page=${page}&limit=${limit}`).then(res => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  })

  const [page, setPage] = React.useState(1)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const limit = 10
  const queryClient = useQueryClient()

  const { data, error, isLoading } = useTourItinerary(page, limit)

  const DeleteTourItinerary = useMutation({
    mutationFn: async (id: string) => {
      return await axios.delete(`/api/tours/itinerary/${id}`)
    },
    onSuccess: () => {
      toast.success("Tour Itinerary deleted successfully")
      queryClient.invalidateQueries({ queryKey: ['toursItinerary'] })
      setOpenDialog(false)
    },
    onError: () => {
      toast.error("Failed to delete tour itinerary")
    }
  })

  if (isLoading) return <TableSkeleton rows={4} columns={4} showImageColumn={false} />
  if (error || !data) return null

  const { data: toursItinerary, total } = data

  return (
    <div className='main overflow-x-auto'>
      <div className="flex items-center">
        <div className="flex items-center gap-2 mt-4">
          <Link href={`/dashboard/tours/itinerary/create/${tourId}`}>
            <Button size="sm" className="mb-2">
              <span className="sm:whitespace-nowrap">Add new tour itinerary</span>
              <PlusCircle className="pl-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle className='text-lg'>Tour Itinerary</CardTitle>
            <CardDescription>Displays a list of tour itinerary available.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader className="bg-[rgba(212,72,59,0.07)]">
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className='hidden sm:table-cell'>Updated At</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {toursItinerary.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        <h3>Data not yet available</h3>
                    </TableCell>
                </TableRow>
                ) : (
                toursItinerary.map((tourItinerary: ToursItinerary, i: number) => (
                    <TableRow key={i}>
                    <TableCell className="font-medium">{tourItinerary.title}</TableCell>
                    <TableCell className="font-medium">
                      {tourItinerary.description.length > 50
                        ? `${tourItinerary.description.slice(0, 50)}...`
                        : tourItinerary.description}
                    </TableCell>
                    <TableCell className="font-medium">{formatDate(tourItinerary.created_at)}</TableCell>
                    <TableCell className="font-medium hidden sm:table-cell">
                        {formatDate(tourItinerary.updated_at)}
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <Link href={`/dashboard/tours/itinerary/update/${tourItinerary.id}`}>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                </Link>
                            <DropdownMenuItem
                            onClick={() => {
                                setSelectedId(tourItinerary.id)
                                setOpenDialog(true)
                            }}
                            >
                            Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))
                )}
            </TableBody>
            </Table>
        </CardContent>
        <CardFooter>
            <Pagination 
            page={page} 
            total={total} 
            limit={limit} 
            onPageChange={setPage} 
            />
        </CardFooter>

        <DeleteConfirmationDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onConfirm={() => {
            if (selectedId) DeleteTourItinerary.mutate(selectedId)
            }}
            isLoading={DeleteTourItinerary.isPending}
        />

      </Card>
    </div>
  )
}

export default TourItineraryTable
