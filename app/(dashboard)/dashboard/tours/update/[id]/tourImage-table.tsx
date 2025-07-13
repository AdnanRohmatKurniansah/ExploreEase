'use client'

import { Button } from '@/app/components/ui/button'
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import React, { useState } from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import TableSkeleton from '@/app/components/shared/table-skeleton'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { ToursImage } from '@/app/types/type'
import Image from 'next/image'
import { formatDate } from '@/app/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu'
import Pagination from '@/app/components/shared/pagination'
import DeleteConfirmationDialog from '@/app/components/shared/delete-modal'

const TourImageTable = ({ tourId }: {tourId: string}) => {
  const useTourImage = (page: number, limit: number, tourId: string) => useQuery({
    queryKey: ['toursImage', page, tourId],
    queryFn: () =>
      axios.get(`/api/tours/image?page=${page}&limit=${limit}&tourId=${tourId}`).then(res => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  })

  const [page, setPage] = React.useState(1)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const limit = 10
  const queryClient = useQueryClient()

  const { data, error, isLoading } = useTourImage(page, limit, tourId)

  const DeleteTourImage = useMutation({
    mutationFn: async (id: string) => {
      return await axios.delete(`/api/tours/image/${id}`)
    },
    onSuccess: () => {
      toast.success("Tour Image deleted successfully")
      queryClient.invalidateQueries({ queryKey: ['toursImage'] })
      setOpenDialog(false)
    },
    onError: () => {
      toast.error("Failed to delete tour image")
    }
  })

  if (isLoading) return <TableSkeleton rows={4} columns={4} showImageColumn={false} />
  if (error || !data) return null

  const { data: toursImage, total } = data

  return (
    <div className='main overflow-x-auto'>
      <div className="flex items-center">
        <div className="flex items-center gap-2 mt-4">
          <Link href={`/dashboard/tours/image/create/${tourId}`}>
            <Button size="sm" className="mb-2">
              <span className="sm:whitespace-nowrap">Add new tour image</span>
              <PlusCircle className="pl-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle className='text-lg'>Tour Image</CardTitle>
            <CardDescription>Displays a list of tour image available.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader className="bg-[rgba(212,72,59,0.07)]">
                <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className='hidden sm:table-cell'>Updated At</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {toursImage.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        <h3>Data not yet available</h3>
                    </TableCell>
                </TableRow>
                ) : (
                toursImage.map((tourImage: ToursImage, i: number) => (
                    <TableRow key={i}>
                    <TableCell>
                        <Image
                            alt={tourImage.title}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={tourImage.image}
                            width="64"
                        />
                    </TableCell>
                    <TableCell className="font-medium">{tourImage.title}</TableCell>
                    <TableCell className="font-medium">{formatDate(tourImage.created_at)}</TableCell>
                    <TableCell className="font-medium hidden sm:table-cell">
                        {formatDate(tourImage.updated_at)}
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
                                <Link href={`/dashboard/tours/image/update/${tourImage.id}`}>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                </Link>
                            <DropdownMenuItem
                            onClick={() => {
                                setSelectedId(tourImage.id)
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
            if (selectedId) DeleteTourImage.mutate(selectedId)
            }}
            isLoading={DeleteTourImage.isPending}
        />

      </Card>
    </div>
  )
}

export default TourImageTable
