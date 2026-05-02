"use client";
import Link from 'next/link';
import { Home, Hand, ShoppingBag, ShoppingCart, MoreHorizontal, LogOut, BookOpen, User, Briefcase, HeartPulse, Heart, Star, X, Gem, Sparkles, Flame, Circle, Hexagon } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ClientOnly from '@/components/shared/ClientOnly';

const readingTypes = [
  { name: "General Personality", query: "General Personality", icon: User },
  { name: "Career & Finance", query: "Career & Finance", icon: Briefcase },
  { name: "Health & Wellness", query: "Health & Wellness", icon: HeartPulse },
  { name: "Marriage & Relationships", query: "Marriage & Relationships", icon: Heart },
  { name: "Comprehensive Analysis", query: "Comprehensive Analysis", icon: Star },
];

const shopItems = [
  { name: "Crystal Bracelets", link: "/products#crystal-bracelets", icon: Sparkles },
  { name: "Gemstones", link: "/products#gemstones", icon: Gem },
  { name: "Pooja Essentials", link: "/products#pooja-essentials", icon: Flame },
  { name: "Rudrakshas", link: "/products#rudrakshas", icon: Circle },
  { name: "Yantras", link: "/products#yantras", icon: Hexagon },
];

const MobileNav = () => {
  const { isAuthenticated, logout, isEditor, isAdmin } = useAppContext();
  const pathname = usePathname();
  const [isPalmistryOpen, setIsPalmistryOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Palmistry', href: '#', icon: Hand },
    { name: 'Shop', href: '#', icon: ShoppingBag },
  ];

  // Determine active route
  const isActive = (href: string, name: string) => {
    if (name === 'Palmistry') return pathname.startsWith('/palm-input');
    if (name === 'Shop') return pathname.startsWith('/products');
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsPalmistryOpen(false);
        setIsShopOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <ClientOnly>
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm" ref={menuRef}>
        
        {/* Palmistry Floating Menu */}
        <AnimatePresence>
          {isPalmistryOpen && (
            <motion.div 
              className="absolute bottom-full mb-6 left-0 right-0 flex flex-col items-center gap-3 pointer-events-none"
            >
              {readingTypes.map((type, index) => {
                const yOffset = 50 + (readingTypes.length - 1 - index) * 65;
                const widthPercent = 100 - (index * 8);

                return (
                <motion.div
                  key={type.name}
                  initial={{ opacity: 0, y: yOffset, scale: 0.1 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 350,
                      damping: 25,
                      delay: index * 0.05
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: yOffset, 
                    scale: 0.1,
                    transition: {
                      type: "spring",
                      stiffness: 350,
                      damping: 25,
                      delay: (readingTypes.length - 1 - index) * 0.05
                    }
                  }}
                  className="pointer-events-auto max-w-[260px] flex justify-center"
                  style={{ width: `${widthPercent}%` }}
                >
                  <Link 
                    href={`/palm-input?category=${encodeURIComponent(type.query)}`}
                    onClick={() => setIsPalmistryOpen(false)}
                    className="flex items-center gap-3 neumorphic-glow bg-[#0a1128]/90 p-2 rounded-2xl w-full transition-all duration-300 hover:scale-105 active:scale-95 border-cyan-500/30 overflow-hidden whitespace-nowrap"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-xl neumorphic-pressed flex items-center justify-center text-cyan-400">
                      <type.icon size={18} />
                    </div>
                    <span className="text-xs font-semibold text-white drop-shadow-md truncate">{type.name}</span>
                  </Link>
                </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shop Floating Menu */}
        <AnimatePresence>
          {isShopOpen && (
            <motion.div 
              className="absolute bottom-full mb-6 left-0 right-0 flex flex-col items-center gap-3 pointer-events-none"
            >
              {shopItems.map((item, index) => {
                const yOffset = 50 + (shopItems.length - 1 - index) * 65;
                const widthPercent = 100 - (index * 8);

                return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: yOffset, scale: 0.1 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 350,
                      damping: 25,
                      delay: index * 0.05
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: yOffset, 
                    scale: 0.1,
                    transition: {
                      type: "spring",
                      stiffness: 350,
                      damping: 25,
                      delay: (shopItems.length - 1 - index) * 0.05
                    }
                  }}
                  className="pointer-events-auto max-w-[260px] flex justify-center"
                  style={{ width: `${widthPercent}%` }}
                >
                  <Link 
                    href={item.link}
                    onClick={() => setIsShopOpen(false)}
                    className="flex items-center gap-3 neumorphic-glow bg-[#0a1128]/90 p-2 rounded-2xl w-full transition-all duration-300 hover:scale-105 active:scale-95 border-purple-500/30 overflow-hidden whitespace-nowrap"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-xl neumorphic-pressed flex items-center justify-center text-purple-400">
                      <item.icon size={18} />
                    </div>
                    <span className="text-xs font-semibold text-white drop-shadow-md truncate">{item.name}</span>
                  </Link>
                </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="neumorphic rounded-[2rem] p-2 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5),_0_0_15px_rgba(200,100,255,0.2)] relative z-10 bg-[#050814]/80 backdrop-blur-md">
          {navItems.map((item) => {
            const active = isActive(item.href, item.name);
            const isPalmistryBtn = item.name === 'Palmistry';
            const isShopBtn = item.name === 'Shop';
            const isInteractiveBtn = isPalmistryBtn || isShopBtn;
            
            const isOpen = isPalmistryBtn ? isPalmistryOpen : isShopOpen;
            
            const handleBtnClick = () => {
              if (isPalmistryBtn) {
                setIsPalmistryOpen(!isPalmistryOpen);
                setIsShopOpen(false);
              } else if (isShopBtn) {
                setIsShopOpen(!isShopOpen);
                setIsPalmistryOpen(false);
              }
            };

            return isInteractiveBtn ? (
              <button
                key={item.name}
                onClick={handleBtnClick}
                className={`relative flex flex-col items-center justify-center w-16 h-14 z-10 cursor-pointer rounded-2xl transition-all duration-300 ${isOpen ? '' : 'hover:neumorphic-pressed'}`}
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-cyan-400"
                    >
                      <X className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-medium text-cyan-400 drop-shadow-md">Close</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="open"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                      {active && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-3xl -z-10 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <item.icon className={`w-5 h-5 mb-1 transition-colors ${active ? 'text-white' : 'text-gray-400'}`} />
                      <span className={`text-[10px] font-medium transition-colors ${active ? 'text-white drop-shadow-md' : 'text-gray-400'}`}>
                        {item.name}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
                {isOpen && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-3xl -z-10 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ) : (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => { setIsPalmistryOpen(false); setIsShopOpen(false); }}
                className={`relative flex flex-col items-center justify-center w-16 h-14 z-10 cursor-pointer rounded-2xl transition-all duration-300 ${active ? '' : 'hover:neumorphic-pressed'}`}
              >
                {active && !isPalmistryOpen && !isShopOpen && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-3xl -z-10 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 mb-1 transition-colors ${active ? 'text-white' : 'text-gray-400'}`} />
                <span className={`text-[10px] font-medium transition-colors ${active ? 'text-white drop-shadow-md' : 'text-gray-400'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                onClick={() => { setIsPalmistryOpen(false); setIsShopOpen(false); }}
                className="relative flex flex-col items-center justify-center w-16 h-14 z-10 cursor-pointer outline-none hover:neumorphic-pressed rounded-2xl transition-all duration-300"
              >
                <MoreHorizontal className="w-5 h-5 mb-1 text-gray-400" />
                <span className="text-[10px] font-medium text-gray-400">More</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="neumorphic text-white w-48 rounded-2xl mb-4 p-2 border-cyan-500/30">
              <DropdownMenuItem asChild className="cursor-pointer hover:neumorphic-pressed rounded-xl focus:neumorphic-pressed">
                <Link href="/cart">
                  <ShoppingCart className="mr-2 h-4 w-4 text-cyan-400" /> Cart
                </Link>
              </DropdownMenuItem>
              {isAuthenticated && !isEditor && !isAdmin && (
                <DropdownMenuItem asChild className="cursor-pointer hover:neumorphic-pressed rounded-xl focus:neumorphic-pressed">
                  <Link href="/report">
                    <BookOpen className="mr-2 h-4 w-4 text-purple-400" /> My Reading
                  </Link>
                </DropdownMenuItem>
              )}
              {isAuthenticated && (
                <>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-400 hover:neumorphic-pressed hover:text-red-300 rounded-xl focus:neumorphic-pressed">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </ClientOnly>
  );
};

export default MobileNav;
