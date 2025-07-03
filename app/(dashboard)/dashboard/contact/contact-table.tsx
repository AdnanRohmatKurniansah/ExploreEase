'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { Button } from '@/app/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Contact } from '@/app/types/type'
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

const ContactTable = () => {
  const useContact = (page: number, limit: number) => useQuery({
    queryKey: ['contact', page],
    queryFn: () =>
      axios.get(`/api/contact?page=${page}&limit=${limit}`).then(res => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  })

  const [page, setPage] = React.useState(1)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const limit = 10
  const queryClient = useQueryClient()

  const { data, error, isLoading } = useContact(page, limit)

  const DeleteContact = useMutation({
    mutationFn: async (id: string) => {
      return await axios.delete(`/api/contact/${id}`)
    },
    onSuccess: () => {
      toast.success("Contact deleted successfully")
      queryClient.invalidateQueries({ queryKey: ['contact'] })
      setOpenDialog(false)
    },
    onError: () => {
      toast.error("Failed to delete contact")
    }
  })

  if (isLoading) return <TableSkeleton rows={4} columns={4} showImageColumn={false} />
  if (error || !data) return null

  const { data: contact, total } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Contact</CardTitle>
        <CardDescription>Displays a list of contact available.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-[rgba(212,72,59,0.07)]">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className='hidden sm:table-cell'>Updated At</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contact.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  <h3>Data not yet available</h3>
                </TableCell>
              </TableRow>
            ) : (
              contact.map((contact: Contact, i: number) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell className="font-medium">{contact.email}</TableCell>
                  <TableCell className="font-medium">
                    {contact.status === 'Read' ? (
                    <Badge variant="default" className="bg-green-500 text-white">Read</Badge>
                    ) : (
                    <Badge variant="outline" className="bg-orange-500 text-white">Not Read</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{formatDate(contact.created_at)}</TableCell>
                  <TableCell className="font-medium hidden sm:table-cell">
                    {formatDate(contact.updated_at)}
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
                        <Link href={`/dashboard/contact/${contact.id}`}>
                          <DropdownMenuItem>View</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedId(contact.id)
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
          if (selectedId) DeleteContact.mutate(selectedId)
        }}
        isLoading={DeleteContact.isPending}
      />

    </Card>
  )
}

export default ContactTable
