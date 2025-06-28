import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import { Skeleton } from '@/app/components/ui/skeleton'

type TableSkeletonProps = {
  rows?: number
  columns?: number
  showImageColumn?: boolean
}

const TableSkeleton = ({
  rows = 5,
  columns = 3,
  showImageColumn = true,
}: TableSkeletonProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          <Skeleton className="h-4 w-[100px]" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-[300px]" />
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader className="bg-[rgba(212,72,59,0.07)]">
            <TableRow>
              {showImageColumn && (
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
              )}
              {Array.from({ length: columns }).map((_, idx) => (
                <TableHead key={idx}><Skeleton className="h-4 w-[100px]" /></TableHead>
              ))}
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <TableRow key={rowIdx}>
                {showImageColumn && (
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-16 w-16 rounded-md" />
                  </TableCell>
                )}
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <TableCell key={colIdx}>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                ))}
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter>
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
          <div>
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-[80px] rounded-md" />
            <Skeleton className="h-8 w-[80px] rounded-md" />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default TableSkeleton
