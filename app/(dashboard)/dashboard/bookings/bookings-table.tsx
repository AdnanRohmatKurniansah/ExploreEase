'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { Button } from '@/app/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BookingTransactions } from '@/app/types/type'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger
} from '@/app/components/ui/dropdown-menu'
import { formatDate } from '@/app/lib/utils'
import TableSkeleton from '@/app/components/shared/table-skeleton'
import Link from 'next/link'
import { toast } from 'sonner'
import Pagination from '@/app/components/shared/pagination'
import DeleteConfirmationDialog from '@/app/components/shared/delete-modal'
import { Badge } from '@/app/components/ui/badge'
import { useRouter } from 'next/navigation'

const BookingsTable = () => {
  const router = useRouter()
  const useBooking = (page: number, limit: number) => useQuery({
    queryKey: ['bookings', page],
    queryFn: () =>
      axios.get(`/api/bookings?page=${page}&limit=${limit}`).then(res => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  })

  const [page, setPage] = React.useState(1)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const limit = 10
  const queryClient = useQueryClient()

  const { data, error, isLoading } = useBooking(page, limit)

  const DeleteBooking = useMutation({
    mutationFn: async (id: string) => {
      return await axios.delete(`/api/bookings/${id}`)
    },
    onSuccess: () => {
      toast.success("Booking deleted successfully")
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      setOpenDialog(false)
    },
    onError: () => {
      toast.error("Failed to delete bookings")
    }
  })

  const MarkRead = useMutation({
    mutationFn: async (id: string) => {
      return await axios.put(`/api/bookings/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
    onError: () => {
      console.error("Can't mark as read")
    }
  })

  if (isLoading) return <TableSkeleton rows={4} columns={4} showImageColumn={false} />
  if (error || !data) return null

  const { data: bookings, total } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Booking</CardTitle>
        <CardDescription>Displays a list of bookings available.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-[rgba(212,72,59,0.07)]">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tour</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className='hidden sm:table-cell'>Updated At</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  <h3>Data not yet available</h3>
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking: BookingTransactions, i: number) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{booking.name}</TableCell>
                  <TableCell className="font-medium">{booking.email}</TableCell>
                  <TableCell className="font-medium">
                    <Link className='underline text-blue-400' href={`/dashboard/tours/update/${booking.tourId}`}>
                      Link
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">Rp. {booking.total_amount.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="font-medium">
                    {booking.payment_status === 'Paid' ? (
                      <Badge variant="default" className="bg-green-500 hover:bg-green-500  text-white">Paid</Badge>
                    ) : booking.payment_status === 'Pending' ? (
                      <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-500 text-white">Pending</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-500 hover:bg-red-500 text-white">Unpaid</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {booking.read_status === 'Read' ? (
                      <Badge variant="default" className="bg-green-500 text-white">Read</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-orange-500 text-white">Not Read</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{formatDate(booking.created_at)}</TableCell>
                  <TableCell className="font-medium hidden sm:table-cell">
                    {formatDate(booking.updated_at)}
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
                        <DropdownMenuItem
                          onClick={async () => {
                            try {
                              MarkRead.mutate(booking.id, {
                                onSuccess: () => {
                                  queryClient.invalidateQueries({ queryKey: ['booking'] })
                                  router.push(`/dashboard/bookings/${booking.id}`)
                                },
                                onError: (error) => {
                                  console.error('Failed to mark as read', error)
                                }
                              })
                            } catch (error) {
                              console.error('Failed to mark as read', error)
                            }
                          }}
                        >View</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedId(booking.id)
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
          if (selectedId) DeleteBooking.mutate(selectedId)
        }}
        isLoading={DeleteBooking.isPending}
      />

    </Card>
  )
}

export default BookingsTable
