'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { Button } from '@/app/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Facility } from '@/app/types/type'
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

const FacilityTable = () => {
  const useFacility = (page: number, limit: number) => useQuery({
    queryKey: ['facility', page],
    queryFn: () =>
      axios.get(`/api/facility?page=${page}&limit=${limit}`).then(res => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  })

  const [page, setPage] = React.useState(1)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const limit = 10
  const queryClient = useQueryClient()

  const { data, error, isLoading } = useFacility(page, limit)

  const DeleteFacility = useMutation({
    mutationFn: async (id: string) => {
      return await axios.delete(`/api/facility/${id}`)
    },
    onSuccess: () => {
      toast.success("Facility deleted successfully")
      queryClient.invalidateQueries({ queryKey: ['facility'] })
      setOpenDialog(false)
    },
    onError: () => {
      toast.error("Failed to delete facility")
    }
  })

  if (isLoading) return <TableSkeleton rows={4} columns={4} showImageColumn={false} />
  if (error || !data) return null

  const { data: facility, total } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Facility</CardTitle>
        <CardDescription>Displays a list of facility available.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-[rgba(212,72,59,0.07)]">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className='hidden sm:table-cell'>Updated At</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facility.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  <h3>Data not yet available</h3>
                </TableCell>
              </TableRow>
            ) : (
              facility.map((facility: Facility, i: number) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{facility.title}</TableCell>
                  <TableCell className="font-medium">
                    {facility.type === 'include' ? (
                    <Badge variant="default" className="bg-blue-500 text-white">Include</Badge>
                    ) : (
                    <Badge variant="outline" className="bg-red-500 text-white">Exclude</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{formatDate(facility.created_at)}</TableCell>
                  <TableCell className="font-medium hidden sm:table-cell">
                    {formatDate(facility.updated_at)}
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
                        <Link href={`/dashboard/facility/update/${facility.id}`}>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedId(facility.id)
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
          if (selectedId) DeleteFacility.mutate(selectedId)
        }}
        isLoading={DeleteFacility.isPending}
      />

    </Card>
  )
}

export default FacilityTable
