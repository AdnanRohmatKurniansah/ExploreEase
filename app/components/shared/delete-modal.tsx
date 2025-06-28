'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Button } from '@/app/components/ui/button'
import Spinner from '@/app/components/ui/spinner'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
}

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, isLoading }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription className="text-gray-500">
            This action cannot be undone. This will permanently delete the selected category from the system.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            Delete
            {isLoading && <span className='ml-2'><Spinner /></span>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteConfirmationDialog
