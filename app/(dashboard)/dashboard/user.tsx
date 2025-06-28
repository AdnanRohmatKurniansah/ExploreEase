'use client';

import { Button } from '@/app/components/ui/button';

import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/app/components/ui/dropdown-menu';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export function User() {
  const { status, data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          color='primary'
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Image
            src='/images/user.png'
            width={36}
            height={36}
            alt="Avatar"
            className="overflow-hidden rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
          <DropdownMenuItem>
              <button onClick={() => signOut({
                redirect: true,
                callbackUrl: '/'
              })}>Sign Out</button>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}