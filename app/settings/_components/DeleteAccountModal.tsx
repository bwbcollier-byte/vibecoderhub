'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/toast';

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

export function DeleteAccountModal({
  open,
  onOpenChange,
  email,
}: DeleteAccountModalProps): React.ReactElement {
  const [confirm, setConfirm] = React.useState('');

  React.useEffect(() => {
    if (!open) setConfirm('');
  }, [open]);

  const canDelete = confirm.trim().toLowerCase() === email.trim().toLowerCase();

  const handleConfirm = (): void => {
    console.error('TODO Slice 26: wire to /api/account/delete');
    onOpenChange(false);
    toast.error('Account deletion is not yet wired');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent width={520}>
        <DialogHeader>
          <DialogTitle>DELETE ACCOUNT.</DialogTitle>
          <DialogDescription>
            This soft-deletes your account with a 30-day undo window. To
            confirm, type your email address below.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-3">
            <Label htmlFor="confirm-email">
              Type{' '}
              <span className="font-mono normal-case tracking-normal text-mint">
                {email}
              </span>{' '}
              to confirm
            </Label>
            <Input
              id="confirm-email"
              type="email"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={email}
              autoComplete="off"
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={!canDelete}
            onClick={handleConfirm}
          >
            Yes, delete my account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
