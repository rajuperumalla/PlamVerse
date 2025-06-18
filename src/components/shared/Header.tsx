
"use client";
import Link from 'next/link';
import { Hand, LogOut, ShieldAlert } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { isAuthenticated, logout, userName, isAdmin } = useAppContext(); // Added isAdmin

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Hand className="h-8 w-8" />
          <h1 className="text-2xl font-headline font-bold">PalmVerse</h1>
        </Link>
        <nav>
          {isAuthenticated && (
            <div className="flex items-center gap-2 sm:gap-4">
              {userName && <span className="text-sm hidden md:inline">Welcome, {userName === 'admin_user' ? 'Admin' : userName}!</span>}
              
              {isAdmin && ( // Conditionally render Admin link
                <Link href="/admin" passHref>
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/80 px-2 sm:px-3">
                    <ShieldAlert className="mr-0 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Admin Panel</span>
                  </Button>
                </Link>
              )}

              <Button variant="ghost" size="sm" onClick={logout} className="text-primary-foreground hover:bg-primary/80 px-2 sm:px-3">
                <LogOut className="mr-0 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
