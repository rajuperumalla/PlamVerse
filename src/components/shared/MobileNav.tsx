"use client";
import Link from 'next/link';
import { Home, Hand, ShoppingBag, ShoppingCart, MoreHorizontal, LogOut, BookOpen, User, Briefcase, HeartPulse, Heart, Star, X, Gem, Sparkles, Flame, Circle, Hexagon } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
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
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Palmistry', href: '#', icon: Hand },
    { name: 'Shop', href: '#', icon: ShoppingBag },
    { name: 'More', href: '#', icon: MoreHorizontal },
  ];

  const resetActiveTab = useCallback(() => {
    if (pathname.startsWith('/palm-input')) setActiveTabId('Palmistry');
    else if (pathname.startsWith('/products')) setActiveTabId('Shop');
    else if (pathname === '/') setActiveTabId('Home');
    else setActiveTabId('');
  }, [pathname]);

  // Sync activeTabId with the current route
  useEffect(() => {
    resetActiveTab();
  }, [resetActiveTab]);

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsPalmistryOpen(false);
        setIsShopOpen(false);
        setIsMoreOpen(false);
        resetActiveTab();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [resetActiveTab]);

  // Handle hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 50 && (currentScrollY - lastScrollY > 10)) {
        setIsVisible(false);
        setIsPalmistryOpen(false);
        setIsShopOpen(false);
        setIsMoreOpen(false);
        resetActiveTab();
      } else if (currentScrollY < lastScrollY && (lastScrollY - currentScrollY > 10)) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, resetActiveTab]);

  const moreItems = [
    { name: "Cart", href: "/cart", icon: ShoppingCart, color: "text-amber-400" },
    { name: "Remedies", href: "/products#remedies", icon: Flame, color: "text-orange-400" },
  ];
  if (isAuthenticated && !isEditor && !isAdmin) {
    moreItems.push({ name: "My Reading", href: "/report", icon: BookOpen, color: "text-amber-300" });
  }
  if (isAuthenticated) {
    moreItems.push({ name: "Logout", href: "", action: logout, icon: LogOut, color: "text-red-400" });
  }

  return (
    <ClientOnly>
      <div 
        className={`md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-[150%]'}`} 
        ref={menuRef}
      >
        
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
                    href={isAuthenticated ? `/palm-input?category=${encodeURIComponent(type.query)}` : '#'}
                    onClick={(e) => {
                      setIsPalmistryOpen(false);
                      resetActiveTab();
                      if (!isAuthenticated) {
                        e.preventDefault();
                        sessionStorage.setItem('palmverse_redirectAfterLogin', `/palm-input?category=${encodeURIComponent(type.query)}`);
                        sessionStorage.setItem('palmverse_authCategory', type.name);
                        window.dispatchEvent(new CustomEvent('update-auth-category', { detail: type.name }));
                        
                        if (pathname !== '/') {
                           window.location.href = '/'; 
                        } else {
                           const formEl = document.getElementById('auth-form-card');
                           if (formEl) {
                              formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                           } else {
                              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                           }
                        }
                      }
                    }}
                    className="flex items-center gap-3 neumorphic-glow bg-[#0a0a16]/90 p-2 rounded-2xl w-full transition-all duration-300 hover:scale-105 active:scale-95 border-amber-500/30 overflow-hidden whitespace-nowrap"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-xl neumorphic-pressed flex items-center justify-center text-amber-400">
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
                    onClick={() => { setIsShopOpen(false); resetActiveTab(); }}
                    className="flex items-center gap-3 neumorphic-glow bg-[#0a0a16]/90 p-2 rounded-2xl w-full transition-all duration-300 hover:scale-105 active:scale-95 border-orange-500/30 overflow-hidden whitespace-nowrap"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-xl neumorphic-pressed flex items-center justify-center text-orange-400">
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

        {/* More Floating Menu */}
        <AnimatePresence>
          {isMoreOpen && (
            <motion.div 
              className="absolute bottom-full mb-6 left-0 right-0 flex flex-col items-center gap-3 pointer-events-none"
            >
              {moreItems.map((item, index) => {
                const yOffset = 50 + (moreItems.length - 1 - index) * 65;
                const widthPercent = 100 - (index * 8);

                const ItemWrapper = item.href ? Link : 'button';
                const props = item.href ? { href: item.href } : {};

                return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: yOffset, scale: 0.1 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { type: "spring", stiffness: 350, damping: 25, delay: index * 0.05 }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: yOffset, 
                    scale: 0.1,
                    transition: { type: "spring", stiffness: 350, damping: 25, delay: (moreItems.length - 1 - index) * 0.05 }
                  }}
                  className="pointer-events-auto max-w-[260px] flex justify-center"
                  style={{ width: `${widthPercent}%` }}
                >
                  <ItemWrapper 
                    {...props}
                    onClick={(e) => {
                      setIsMoreOpen(false);
                      resetActiveTab();
                      if (item.action && !item.href) {
                        e.preventDefault();
                        item.action();
                      }
                    }}
                    className="flex items-center gap-3 neumorphic-glow bg-[#0a0a16]/90 p-2 rounded-2xl w-full transition-all duration-300 hover:scale-105 active:scale-95 border-blue-500/30 overflow-hidden whitespace-nowrap"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-xl neumorphic-pressed flex items-center justify-center">
                      <item.icon size={18} className={item.color} />
                    </div>
                    <span className={`text-xs font-semibold ${item.name === 'Logout' ? 'text-red-400' : 'text-white'} drop-shadow-md truncate`}>{item.name}</span>
                  </ItemWrapper>
                </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="neumorphic rounded-[2rem] p-2 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5),_0_0_15px_rgba(212,175,55,0.15)] relative z-10 bg-[#06060F]/85 backdrop-blur-md">
          {navItems.map((item) => {
            const isTabActive = activeTabId === item.name;
            const isPalmistryBtn = item.name === 'Palmistry';
            const isShopBtn = item.name === 'Shop';
            const isMoreBtn = item.name === 'More';
            const isInteractiveBtn = isPalmistryBtn || isShopBtn || isMoreBtn;
            
            const isOpen = isPalmistryBtn ? isPalmistryOpen : isShopBtn ? isShopOpen : isMoreOpen;
            
            const handleBtnClick = () => {
              if (isOpen) {
                // Close menu
                setIsPalmistryOpen(false);
                setIsShopOpen(false);
                setIsMoreOpen(false);
                resetActiveTab();
              } else {
                // Open menu
                setActiveTabId(item.name);
                if (isPalmistryBtn) {
                  setIsPalmistryOpen(true);
                  setIsShopOpen(false);
                  setIsMoreOpen(false);
                } else if (isShopBtn) {
                  setIsShopOpen(true);
                  setIsPalmistryOpen(false);
                  setIsMoreOpen(false);
                } else if (isMoreBtn) {
                  setIsMoreOpen(true);
                  setIsPalmistryOpen(false);
                  setIsShopOpen(false);
                }
              }
            };

            return isInteractiveBtn ? (
              <button
                key={item.name}
                onClick={handleBtnClick}
                className={`relative flex flex-col items-center justify-center w-16 h-14 z-10 cursor-pointer rounded-2xl transition-all duration-300 ${isOpen ? 'neumorphic-pressed scale-95' : isTabActive ? '' : 'hover:neumorphic-pressed'}`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {isTabActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl -z-10 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon className={`w-5 h-5 mb-1 transition-all duration-300 z-10 ${isOpen ? 'text-amber-400 scale-90' : isTabActive ? 'text-white' : 'text-gray-400'}`} />
                  <span className={`text-[10px] font-medium transition-all duration-300 z-10 ${isOpen ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]' : isTabActive ? 'text-white drop-shadow-md' : 'text-gray-400'}`}>
                    {item.name}
                  </span>
                </div>
              </button>
            ) : (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => { setActiveTabId(item.name); setIsPalmistryOpen(false); setIsShopOpen(false); setIsMoreOpen(false); }}
                className={`relative flex flex-col items-center justify-center w-16 h-14 z-10 cursor-pointer rounded-2xl transition-all duration-300 ${isTabActive ? '' : 'hover:neumorphic-pressed'}`}
              >
                {isTabActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl -z-10 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 mb-1 transition-colors z-10 ${isTabActive ? 'text-white' : 'text-gray-400'}`} />
                <span className={`text-[10px] font-medium transition-colors z-10 ${isTabActive ? 'text-white drop-shadow-md' : 'text-gray-400'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </ClientOnly>
  );
};

export default MobileNav;
