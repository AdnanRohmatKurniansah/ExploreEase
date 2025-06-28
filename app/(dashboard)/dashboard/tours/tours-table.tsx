'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { Button } from '@/app/components/ui/button'
import { CheckCircle, MoreHorizontal, XCircleIcon } from 'lucide-react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Tours } from '@/app/types/type'
import Image from 'next/image'
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

const TourTable = () => {
  const useTours = (page: number, limit: number) => useQuery({
    queryKey: ['tours', page],
    queryFn: () =>
      axios.get(`/api/tours?page=${page}&limit=${limit}`).then(res => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  })

  const [page, setPage] = React.useState(1)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const limit = 10
  const queryClient = useQueryClient()

  const { data, error, isLoading } = useTours(page, limit)

  const DeleteTour = useMutation({
    mutationFn: async (id: string) => {
      return await axios.delete(`/api/tours/${id}`)
    },
    onSuccess: () => {
      toast.success("Tour deleted successfully")
      queryClient.invalidateQueries({ queryKey: ['tours'] })
      setOpenDialog(false)
    },
    onError: () => {
      toast.error("Failed to delete tour")
    }
  })

  if (isLoading) return <TableSkeleton rows={4} columns={4} showImageColumn={false} />
  if (error || !data) return null

  const { data: tours, total } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Tours</CardTitle>
        <CardDescription>Displays a list of tours available.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-[rgba(212,72,59,0.07)]">
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Popular</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className='hidden sm:table-cell'>Updated At</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tours.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  <h3>Data not yet available</h3>
                </TableCell>
              </TableRow>
            ) : (
              tours.map((tour: Tours, i: number) => (
                <TableRow key={i}>
                  <TableCell>
                    <Image
                      alt={tour.title}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={tour.image}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{tour.title}</TableCell>
                  <TableCell className="font-medium">
                    {tour.is_popular == true ? (
                    <Badge variant="default" className="bg-green-500 text-white"><CheckCircle /></Badge>
                    ) : (
                    <Badge variant="outline" className="bg-red-500 text-white"><XCircleIcon /></Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{tour.category.name}</TableCell>
                  <TableCell className="font-medium">{tour.destination.name}</TableCell>
                  <TableCell className="font-medium">{formatDate(tour.created_at)}</TableCell>
                  <TableCell className="font-medium hidden sm:table-cell">
                    {formatDate(tour.updated_at)}
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
                        <Link href={`/dashboard/tours/update/${tour.id}`}>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedId(tour.id)
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
          if (selectedId) DeleteTour.mutate(selectedId)
        }}
        isLoading={DeleteTour.isPending}
      />

    </Card>
  )
}

export default TourTable
