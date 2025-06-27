
"use client";
import Link from 'next/link';
import { Hand, LogOut, Edit, ShieldCheck, BookOpen, Calculator, ShoppingBag, ChevronDown, UserCircle, HomeIcon, Zap, Handshake, LayoutDashboard, ListChecks, FileCheck2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from 'react';
import ClientOnly from '@/components/shared/ClientOnly';

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
  { name: "Crystal Bracelets", link: "/products#crystal-bracelets" },
  { name: "Gemstones", link: "/products#gemstones" },
  { name: "Pooja Essentials", link: "/products#pooja-essentials" },
  { name: "Rudrakshas", link: "/products#rudrakshas" },
  { name: "Yantras", link: "/products#yantras" },
];

const Header = () => {
  const { isAuthenticated, logout, userName, isEditor, isAdmin } = useAppContext();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeStates, setActiveStates] = useState({
    isHomePageActive: false,
    isPalmInputPageActive: false,
    isNumerologyInputPageActive: false,
    isReportPageActive: false,
    isProductsPageActive: false,
    isEditorDashboardActive: false,
    isEditorWorkflowPageActive: false,
    isEditorApprovedPageActive: false,
  });

  useEffect(() => {
    const palmCategoryFromQuery = searchParams ? searchParams.get('category') : null;
    const numeroServiceFromQuery = searchParams ? searchParams.get('service') : null;

    setActiveStates({
      isHomePageActive: pathname === '/',
      isPalmInputPageActive: pathname === '/palm-input' && !!readingTypes.find(rt => rt.query === palmCategoryFromQuery),
      isNumerologyInputPageActive: pathname === '/numerology-input' && !!numerologyServicesConst.find(ns => ns.query === numeroServiceFromQuery),
      isReportPageActive: pathname === '/report',
      isProductsPageActive: pathname.startsWith('/products'),
      isEditorDashboardActive: pathname === '/editor',
      isEditorWorkflowPageActive: pathname === '/editor/workflow' || pathname.startsWith('/editor/review'),
      isEditorApprovedPageActive: pathname === '/editor/approved',
    });
  }, [pathname, searchParams]);

  const getLinkClassName = (isActive: boolean) => {
    return `transition-colors px-2 py-1.5 rounded-md text-sm flex items-center hover:bg-primary/80 focus:bg-primary/80 ${isActive ? 'bg-primary/70 font-semibold' : 'hover:bg-primary/60'}`;
  };

  const getDropdownTriggerClassName = (isActive: boolean) => {
    return `transition-colors px-2 py-1.5 rounded-md text-sm flex items-center hover:bg-primary/80 focus:bg-primary/80 ${isActive ? 'bg-primary/70 font-semibold' : 'hover:bg-primary/60'}`;
  }

  const renderUserHeader = () => (
    <>
      <Link href="/" className="flex-shrink-0 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Handshake className="h-7 w-7 sm:h-8 sm:w-8" />
        <h1 className="text-xl sm:text-2xl font-headline font-bold">PalmVerse</h1>
      </Link>
    
      <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 ml-6 flex-grow">
        <Link href="/" className={getLinkClassName(activeStates.isHomePageActive)}>
          <HomeIcon className="mr-1.5 h-4 w-4" /> Home
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={getDropdownTriggerClassName(activeStates.isPalmInputPageActive)}>
              <Hand className="mr-1.5 h-4 w-4" /> Palmistry <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-primary border-primary-foreground/20 text-primary-foreground">
            {readingTypes.map((type) => (
              <DropdownMenuItem key={type.query} asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20">
                <Link href={`/palm-input?category=${encodeURIComponent(type.query)}`} className="w-full">
                  {type.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={getDropdownTriggerClassName(activeStates.isNumerologyInputPageActive)}>
              <Calculator className="mr-1.5 h-4 w-4" /> Numerology <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-primary border-primary-foreground/20 text-primary-foreground">
            {numerologyServicesConst.map((service) => (
              <DropdownMenuItem key={service.query} asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20">
                <Link href={`/numerology-input?service=${encodeURIComponent(service.query)}`} className="w-full">
                  {service.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {isAuthenticated && (
            <Link href="/report" className={getLinkClassName(activeStates.isReportPageActive)}>
              <BookOpen className="mr-1.5 h-4 w-4" /> My Reading
            </Link>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={getDropdownTriggerClassName(activeStates.isProductsPageActive)}>
              <ShoppingBag className="mr-1.5 h-4 w-4" /> Products <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-primary border-primary-foreground/20 text-primary-foreground">
            {productMenuItems.map((item) => (
              <DropdownMenuItem key={item.name} asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20">
                <Link href={item.link} className="w-full">
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-primary-foreground/20"/>
            <DropdownMenuItem disabled className="opacity-70 italic">More coming soon!</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href="#remedies" className={getLinkClassName(false) + " opacity-70 cursor-not-allowed"} onClick={(e) => e.preventDefault()}>
          <Zap className="mr-1.5 h-4 w-4" /> Remedies
        </Link>
      </nav>
    </>
  );

  const renderEditorHeader = () => (
    <>
      <Link href="/editor" className="flex-shrink-0 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Edit className="h-7 w-7 sm:h-8 sm:w-8" />
        <h1 className="text-xl sm:text-2xl font-headline font-bold">PalmVerse Editor</h1>
      </Link>
      <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 ml-6 flex-grow">
        <Link href="/editor" className={getLinkClassName(activeStates.isEditorDashboardActive)}>
          <LayoutDashboard className="mr-1.5 h-4 w-4" />
          Dashboard
        </Link>
        <Link href="/editor/workflow" className={getLinkClassName(activeStates.isEditorWorkflowPageActive)}>
          <ListChecks className="mr-1.5 h-4 w-4" />
          Pending Reviews
        </Link>
        <Link href="/editor/approved" className={getLinkClassName(activeStates.isEditorApprovedPageActive)}>
          <FileCheck2 className="mr-1.5 h-4 w-4" />
          Approved Reports
        </Link>
      </nav>
    </>
  );

  const renderAdminHeader = () => (
    <>
      <Link href="/admin" className="flex-shrink-0 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8" />
        <h1 className="text-xl sm:text-2xl font-headline font-bold">PalmVerse Admin</h1>
      </Link>
      <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 ml-6 flex-grow">
        {/* Admin nav remains simple in header as sidebar handles complex navigation */}
      </nav>
    </>
  );
  
  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-40">
      <div className="container px-4 py-3 flex items-center">
        <ClientOnly>
          {isEditor ? renderEditorHeader() :
           isAdmin ? renderAdminHeader() :
           renderUserHeader()
          }
        </ClientOnly>

        <div className="flex items-center gap-2 ml-auto">
          <ClientOnly>
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full h-9 w-9 p-0 sm:h-10 sm:w-10 hover:bg-primary/80">
                    <UserCircle className="h-6 w-6 sm:h-7 sm:w-7" />
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-primary border-primary-foreground/20 text-primary-foreground w-48">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {isEditor ? "Editor" : isAdmin ? "Admin" : (userName || "User")}
                      </p>
                      {!(isEditor || isAdmin) && userName && (
                          <p className="text-xs leading-none text-primary-foreground/80">
                          {userName.includes('@') ? userName : `${userName.substring(0,10)}...`}
                          </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary-foreground/20"/>
                  {isEditor && (
                    <DropdownMenuItem asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20">
                      <Link href="/editor">
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Editor Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <DropdownMenuItem asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20">
                      <Link href="/admin">
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                 {isAuthenticated && !isEditor && !isAdmin && (
                    <DropdownMenuItem asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20">
                        <Link href="/report">
                            <BookOpen className="mr-2 h-4 w-4" /> My Reading
                        </Link>
                    </DropdownMenuItem>
                  )}
                {(isEditor || isAdmin || (isAuthenticated && !isEditor && !isAdmin)) && <DropdownMenuSeparator className="bg-primary-foreground/20"/>}
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-300 hover:!bg-red-500/50 focus:!bg-red-500/50 hover:!text-white">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
              </DropdownMenu>
            )}
          </ClientOnly>
          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="md:hidden h-9 w-9 p-0 sm:h-10 sm:w-10 hover:bg-primary/80">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-primary border-primary-foreground/20 text-primary-foreground md:hidden w-56">
                <ClientOnly>
                  {isEditor ? (
                    <>
                      <DropdownMenuItem asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20"><Link href="/editor">Dashboard</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20"><Link href="/editor/workflow">Pending Reviews</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20"><Link href="/editor/approved">Approved Reports</Link></DropdownMenuItem>
                    </>
                  ) : isAdmin ? (
                     <>
                      <DropdownMenuItem asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20"><Link href="/admin">Dashboard</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20"><Link href="/admin/workflow">Report Workflow</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20"><Link href="/admin/products">Products</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20"><Link href="/admin/orders">Orders</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20"><Link href="/admin/settings">Settings</Link></DropdownMenuItem>
                     </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20"><Link href="/">Home</Link></DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-primary-foreground/20"/>
                      <DropdownMenuLabel>Palmistry</DropdownMenuLabel>
                      {readingTypes.map(item => <DropdownMenuItem key={item.query} asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20"><Link href={`/palm-input?category=${encodeURIComponent(item.query)}`}>{item.name}</Link></DropdownMenuItem>)}
                      <DropdownMenuSeparator className="bg-primary-foreground/20"/>
                      <DropdownMenuLabel>Numerology</DropdownMenuLabel>
                      {numerologyServicesConst.map(item => <DropdownMenuItem key={item.query} asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20"><Link href={`/numerology-input?service=${encodeURIComponent(item.query)}`}>{item.name}</Link></DropdownMenuItem>)}
                      <DropdownMenuSeparator className="bg-primary-foreground/20"/>
                      {isAuthenticated && <DropdownMenuItem asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20"><Link href="/report">My Reading</Link></DropdownMenuItem>}
                      <DropdownMenuItem asChild className="cursor-pointer hover:!bg-primary-foreground/20 focus:!bg-primary-foreground/20"><Link href="/products">Products</Link></DropdownMenuItem>
                    </>
                  )}
                </ClientOnly>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
