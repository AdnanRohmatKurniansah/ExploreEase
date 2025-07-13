import Link from 'next/link';
import {
  Bed,
  BookIcon,
  Home,
  Map,
  MessageCircle,
  PanelLeft,
  Plane,
  Settings,
  Ticket,
} from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/app/components/ui/breadcumb';
import { Button } from '@/app/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/app/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/app/components/ui/tooltip';
import { Logo } from '@/app/components/icons';
import Providers from './providers';
import { NavItem } from './nav-item';
import { SearchInput } from './search';
import { User } from './user';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
            <DashboardBreadcrumb />
            <SearchInput />
            <User />
          </header>
          <main className="grid flex-1 items-start gap-2 border-t p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
      </main>
    </Providers>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <NavItem href="/dashboard" label="Dashboard">
          <Home className="h-5 w-5" />
        </NavItem>

        <NavItem href="/dashboard/categories" label="Categories">
          <Map className="h-5 w-5" />
        </NavItem>

        <NavItem href="/dashboard/destinations" label="Destinations">
          <Plane className="h-5 w-5" />
        </NavItem>

        <NavItem href="/dashboard/facility" label="Tour's Facility">
          <Bed className="h-5 w-5" />
        </NavItem>

        <NavItem href="/dashboard/tours" label="Tours">
          <Ticket className="h-5 w-5" />
        </NavItem>

        <NavItem href="/dashboard/bookings" label="Bookings">
          <BookIcon className="h-5 w-5" />
        </NavItem>

        <NavItem href="/dashboard/contact" label="Contact">
          <MessageCircle className="h-5 w-5" />
        </NavItem>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <SheetHeader>
          <VisuallyHidden>
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Select a page or action</SheetDescription>
          </VisuallyHidden> 
        </SheetHeader>
        <nav className="grid gap-6 text-lg font-medium">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/categories"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Map className="h-5 w-5" />
            Categories
          </Link>
          <Link
            href="/dashboard/destinations"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Plane className="h-5 w-5" />
            Destinations
          </Link>
          <Link
            href="/dashboard/facility"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Bed className="h-5 w-5" />
            Tour's Facility
          </Link>
          <Link
            href="/dashboard/tours"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Ticket className="h-5 w-5" />
            Tours
          </Link>
          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <BookIcon className="h-5 w-5" />
            Bookings
          </Link>
          <Link
            href="/dashboard/contact"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="h-5 w-5" />
            Contact
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function DashboardBreadcrumb() {
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">
              <Logo />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}