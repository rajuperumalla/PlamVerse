
"use client";
import Link from 'next/link';
import { Hand, LogOut, Edit, ShieldCheck, BookOpen, ShoppingBag, ChevronDown, UserCircle, HomeIcon, Zap, Handshake, LayoutDashboard, ListChecks, FileCheck2, ShoppingCart } from 'lucide-react';
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
    isReportPageActive: false,
    isProductsPageActive: false,
    isCartPageActive: false,
    isEditorDashboardActive: false,
    isEditorWorkflowPageActive: false,
    isEditorApprovedPageActive: false,
  });

  useEffect(() => {
    const palmCategoryFromQuery = searchParams ? searchParams.get('category') : null;

    setActiveStates({
      isHomePageActive: pathname === '/',
      isPalmInputPageActive: pathname === '/palm-input' && !!readingTypes.find(rt => rt.query === palmCategoryFromQuery),
      isReportPageActive: pathname === '/report',
      isProductsPageActive: pathname.startsWith('/products'),
      isCartPageActive: pathname.startsWith('/cart'),
      isEditorDashboardActive: pathname === '/editor',
      isEditorWorkflowPageActive: pathname === '/editor/workflow' || pathname.startsWith('/editor/review'),
      isEditorApprovedPageActive: pathname === '/editor/approved',
    });
  }, [pathname, searchParams]);

  const getLinkClassName = (isActive: boolean) => {
    return `transition-all px-2 py-1.5 rounded-md text-sm flex items-center hover:text-amber-400 focus:text-amber-400 ${isActive ? 'text-amber-300 font-semibold drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'text-amber-100/70'}`;
  };

  const getDropdownTriggerClassName = (isActive: boolean) => {
    return `transition-all px-2 py-1.5 rounded-md text-sm flex items-center hover:text-amber-400 focus:text-amber-400 ${isActive ? 'text-amber-300 font-semibold drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'text-amber-100/70'}`;
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
        
        {isAuthenticated && (
            <Link href="/report" className={getLinkClassName(activeStates.isReportPageActive)}>
              <BookOpen className="mr-1.5 h-4 w-4" /> My Reading
            </Link>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={getDropdownTriggerClassName(activeStates.isProductsPageActive)}>
              <ShoppingBag className="mr-1.5 h-4 w-4" /> Shop <ChevronDown className="ml-1 h-3 w-3" />
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
        
        <Link href="/cart" className={getLinkClassName(activeStates.isCartPageActive)}>
          <ShoppingCart className="mr-1.5 h-4 w-4" /> Cart
        </Link>

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
        {/* Admin nav is now handled by the dedicated sidebar in the admin layout */}
      </nav>
    </>
  );
  
  return (
    <header className="bg-black/40 backdrop-blur-md border-b border-white/10 text-white shadow-md sticky top-0 z-40">
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
                {(isEditor || isAdmin) && <DropdownMenuSeparator className="bg-primary-foreground/20"/>}
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-300 hover:!bg-red-500/50 focus:!bg-red-500/50 hover:!text-white">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
              </DropdownMenu>
            )}
          </ClientOnly>

        </div>
      </div>
    </header>
  );
};

export default Header;

    