'use client'

import { Book, Heart, Menu, Search, Sunset, Trees, Zap } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { Button } from "@/app/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/app/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { Input } from "../ui/input";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
  };
  menu?: MenuItem[];
  option?: {
    wishlist: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: "/",
    src: "/images/logo.png",
    alt: "logo exploreease",
  },
  menu = [
    { title: "Home", url: "/" },
    { title: "Tours", url: "/tours" },
    { title: "Destinations", url: "/destinations" },
    { title: "Contact", url: "/contact" },
  ],
  option = {
    wishlist: { title: "Wishlist", url: "/wishlist" },
  },
}: NavbarProps) => {
  return (
    <section className="sticky top-0 z-50 bg-white py-3 px-5 md:px-14 border-b shadow-sm">
      <div className="container">
        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center justify-between gap-4">
          {/* Logo + Search */}
          <div className="flex items-center gap-4 w-full">
            <Link href={logo.url} className="flex items-center gap-2 shrink-0">
              <Image src={logo.src} width={0} height={0} sizes="100vw" className="h-14 w-auto" alt={logo.alt} />
            </Link>
            <div className="relative w-full ps-2">
              <span className="absolute inset-y-0 start-4 flex items-center text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <Input
                type="text"
                placeholder="Search tours or destinations"
                className="w-full rounded-full border-2 py-2 ps-10 pe-4 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Wishlist */}
          <div className="flex items-center gap-2 w-1/3 justify-end">
            <Button asChild size="default">
              <Link className="group" href={option.wishlist.url}>
                <Heart className="mr-2" /> {option.wishlist.title}
              </Link>
            </Button>
          </div>
        </nav>

        {/* MOBILE NAV */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2">
              <Image width={0} height={0} sizes="100vw" src={logo.src} className="max-h-12 w-auto" alt={logo.alt} />
            </Link>
            <div className="search ps-2 flex items-center rounded-full border-2 w-1/2">
              <Search className="h-4" />
              <input
                type="text"
                placeholder="Search tours or destinations"
                className="w-full rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-none"
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href={logo.url} className="flex items-center gap-2">
                      <Image width={0} height={0} sizes="100vw" src={logo.src} className="max-h-12 w-auto" alt={logo.alt} />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    <Button asChild>
                      <Link href={option.wishlist.url}>{option.wishlist.title}</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <Link
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </Link>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} href={item.url} className="text-md font-semibold group">
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar };
