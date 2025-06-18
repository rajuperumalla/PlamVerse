
"use client";
import Link from 'next/link';
import { Hand, LogOut } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { isAuthenticated, logout, userName } = useAppContext();

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Hand className="h-8 w-8" />
          <h1 className="text-2xl font-headline font-bold">PalmVerse</h1>
        </Link>
        <nav>
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="text-sm">Welcome!</span> {/* Simplified, could show userName */}
              <Button variant="ghost" size="sm" onClick={logout} className="text-primary-foreground hover:bg-primary/80">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
