import prisma from "@/app/lib/prisma";
import { Facebook, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface FooterProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
  };
  description?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer = async ({
  logo = {
    src: "/images/logo.png",
    alt: "logo exploreease",
    url: "/",
  },
  description = "Discover your next great adventure with us. From hidden gems to iconic destinations, we’re here to make your travel dreams easy, memorable, and worry-free.",
  menuItems = [
    {
      title: "Navigation",
      links: [
        { text: "Home", url: "/" },
        { text: "Tours", url: "/tours" },
        { text: "Destinations", url: "/destinations" },
        { text: "Contact", url: "/contact" },
      ],
    },
  ],
  copyright = "© 2025 ARK. All rights reserved.",
  bottomLinks = [
    { text: "Terms and Conditions", url: "#" },
    { text: "Privacy Policy", url: "#" },
  ],
}: FooterProps) => {
  const categories = await prisma.categories.findMany({
    take: 6
  })
  const destinations = await prisma.destinations.findMany({
    take: 6
  })
  const shuffled = categories.sort(() => 0.5 - Math.random())
  const randomCategories = shuffled.slice(0, 5)

  const shuffled2 = destinations.sort(() => 0.5 - Math.random())
  const randomDestinations = shuffled2.slice(0, 5)

  const mergedMenuItems: MenuItem[] = [
    {
      title: "Categories",
      links: randomCategories.map((cat) => ({
        text: cat.name,
        url: `/categories/${cat.slug}`,
      })),
    },
    {
      title: "Destinations",
      links: randomDestinations.map((det) => ({
        text: det.name,
        url: `/destinations/${det.slug}`,
      })),
    },
    ...menuItems,
  ];  

  return (
    <section className="pt-20 pb-5 px-5 md:px-14 bg-[#F3F6F9]">
      <div className="container">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <Link href={logo.url} className="shrink-0">
                  <Image src={logo.src} width={0} height={0} sizes="100vw" className="h-14 w-auto" alt={logo.alt} />
                </Link>
              </div>
              <p className="mt-4 text-gray-700 font-normal mb-5">{description}</p>
              <ul className="social-media flex gap-2">
                <li className="w-9 h-9 flex items-center justify-center bg-white hover:bg-primary rounded-full border border-primary text-primary hover:text-white transition-all">
                  <Link className="group" href={'#'}>
                    <Facebook className="w-5 h-5" />
                  </Link>
                </li>
                <li className="w-9 h-9 flex items-center justify-center bg-white hover:bg-primary rounded-full border border-primary text-primary hover:text-white transition-all">
                  <Link className="group" href={'#'}>
                    <Instagram className="w-5 h-5" />
                  </Link>
                </li>
                <li className="w-9 h-9 flex items-center justify-center bg-white hover:bg-primary rounded-full border border-primary text-primary hover:text-white transition-all">
                  <Link className="group" href={'#'}>
                    <Youtube className="w-5 h-5" />
                  </Link>
                </li>
              </ul>

            </div>
            <div className="hidden md:block"></div>
            {mergedMenuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold flex items-center">
                  <span className="h-1 w-5 me-2 bg-primary rounded-md"></span>
                  {section.title}
                </h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="text-gray-700 hover:text-primary"
                    >
                      <Link className="group" href={link.url}>{link.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-24 flex flex-col text-center justify-center gap-4 border-t pt-8 text-[13px] text-gray-700 md:items-center">
            <p>{copyright}</p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer };
