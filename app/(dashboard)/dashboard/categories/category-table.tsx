'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { Button } from '@/app/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Categories } from '@/app/types/type'
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

const CategoryTable = () => {
  const useCategories = (page: number, limit: number) => useQuery({
    queryKey: ['categories', page],
    queryFn: () =>
      axios.get(`/api/categories?page=${page}&limit=${limit}`).then(res => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  })

  const [page, setPage] = React.useState(1)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const limit = 10
  const queryClient = useQueryClient()

  const { data, error, isLoading } = useCategories(page, limit)

  const DeleteCategory = useMutation({
    mutationFn: async (id: string) => {
      return await axios.delete(`/api/categories/${id}`)
    },
    onSuccess: () => {
      toast.success("Category deleted successfully")
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setOpenDialog(false)
    },
    onError: () => {
      toast.error("Failed to delete category")
    }
  })

  if (isLoading) return <TableSkeleton rows={4} columns={4} showImageColumn={false} />
  if (error || !data) return null

  const { data: categories, total } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Categories</CardTitle>
        <CardDescription>Displays a list of categories available.</CardDescription>
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
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  <h3>Data not yet available</h3>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category: Categories, i: number) => (
                <TableRow key={i}>
                  <TableCell>
                    <Image
                      alt={category.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={category.icon}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="font-medium">{formatDate(category.created_at)}</TableCell>
                  <TableCell className="font-medium hidden sm:table-cell">
                    {formatDate(category.updated_at)}
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
                        <Link href={`/dashboard/categories/update/${category.id}`}>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedId(category.id)
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
          if (selectedId) DeleteCategory.mutate(selectedId)
        }}
        isLoading={DeleteCategory.isPending}
      />

    </Card>
  )
}

export default CategoryTable
