
"use client";

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Handshake, BookOpen, ChevronDown, ShoppingBag, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const readingTypes = [
  { name: "General Personality", query: "General Personality" },
  { name: "Career & Finance", query: "Career & Finance" },
  { name: "Health & Wellness", query: "Health & Wellness" },
  { name: "Marriage & Relationships", query: "Marriage & Relationships" },
  { name: "Comprehensive Analysis", query: "Comprehensive Analysis" },
];

const numerologyServicesConst = [
  { name: "Business Name Numerology Calculator", query: "business-name-calculator" },
  { name: "Baby Name Numerology", query: "baby-name-numerology" },
  { name: "Personal Life Path & Destiny Report", query: "life-path-report" },
  { name: "Name Correction & Compatibility Checker", query: "name-correction" },
  { name: "House Number / Address Compatibility", query: "address-compatibility" },
];

const productMenuItems = [
  { name: "Crystal Bracelets", link: "#products/crystal-bracelets" },
  { name: "Gemstones", link: "#products/gemstones" },
  { name: "Pooja Essentials", link: "#products/pooja-essentials" },
  { name: "Rudrakshas", link: "#products/rudrakshas" },
  { name: "Yantras", link: "#products/yantras" },
];


function SubHeaderNavigationContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const palmCategoryFromQuery = searchParams ? searchParams.get('category') : null;
  const numeroServiceFromQuery = searchParams ? searchParams.get('service') : null;

  const isPalmInputPage = pathname === '/palm-input';
  const isNumerologyInputPage = pathname === '/numerology-input';
  const isReportPage = pathname === '/report';

  const isPalmistryActive = isPalmInputPage && !!readingTypes.find(rt => rt.query === palmCategoryFromQuery);
  const isNumerologyActive = isNumerologyInputPage && !!numerologyServicesConst.find(ns => ns.query === numeroServiceFromQuery);
  const isMyReadingActive = isReportPage;


  if (pathname === '/' || pathname.startsWith('/admin') || pathname.startsWith('/editor') || pathname === '/payment') {
    return null; // Don't show this nav on home, admin, editor, or payment pages
  }

  return (
    <nav aria-label="Secondary navigation" className="mb-8">
      <ul className="flex justify-center items-center space-x-1 sm:space-x-2 md:space-x-4 py-3 bg-primary/10 backdrop-blur-sm rounded-lg shadow-md border border-primary/30 text-xs sm:text-sm">
        <li>
          <Link href="/" className="text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md">
            Home
          </Link>
        </li>
        <li>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`transition-colors px-2 py-1 rounded-md flex items-center hover:bg-primary/5 focus:bg-primary/10 ${isPalmistryActive ? 'font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent animate-shimmer bg-[length:200%_100%] ring-1 ring-primary/50 bg-primary/10' : 'text-foreground hover:text-primary'}`}
              >
                <Handshake className="inline-block mr-1 h-4 w-4 align-middle" /> Palmistry <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-background border-primary/30 shadow-xl">
              {readingTypes.map((type) => (
                <DropdownMenuItem key={type.query} asChild className="cursor-pointer hover:bg-primary/10">
                  <Link href={`/palm-input?category=${encodeURIComponent(type.query)}`} className="w-full text-foreground">
                    {type.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
        <li>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`transition-colors px-2 py-1 rounded-md flex items-center hover:bg-primary/5 focus:bg-primary/10 ${isNumerologyActive ? 'font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent animate-shimmer bg-[length:200%_100%] ring-1 ring-primary/50 bg-primary/10' : 'text-foreground hover:text-primary'}`}
              >
                <Calculator className="inline-block mr-1 h-4 w-4 align-middle" /> Numerology <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-background border-primary/30 shadow-xl">
              {numerologyServicesConst.map((service) => (
                <DropdownMenuItem key={service.query} asChild className="cursor-pointer hover:bg-primary/10">
                  <Link href={`/numerology-input?service=${encodeURIComponent(service.query)}`} className="w-full text-foreground">
                    {service.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
        <li>
          <Link href="/report" className={`transition-colors px-2 py-1 rounded-md ${isMyReadingActive ? 'font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent animate-shimmer bg-[length:200%_100%] ring-1 ring-primary/50 bg-primary/10' : 'text-foreground hover:text-primary'}`}>
            <BookOpen className="inline-block mr-1 h-4 w-4 align-middle" /> My Reading
          </Link>
        </li>
        <li>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md flex items-center hover:bg-primary/5 focus:bg-primary/10"
              >
                <ShoppingBag className="inline-block mr-1 h-4 w-4 align-middle" /> Products <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-background border-primary/30 shadow-xl">
              {productMenuItems.map((item) => (
                <DropdownMenuItem key={item.name} asChild className="cursor-pointer hover:bg-primary/10">
                  <Link href={item.link} className="w-full text-foreground">
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
        <li>
          <Link href="#remedies" className="text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md">
            Remedies
          </Link>
        </li>
      </ul>
    </nav>
  );
}


export default function SubHeaderNavigation() {
  // Suspense is needed because useSearchParams is used internally by SubHeaderNavigationContent
  return (
    <Suspense fallback={null}>
      <SubHeaderNavigationContent />
    </Suspense>
  )
}
