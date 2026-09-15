'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Menu, X, Coffee, ChevronDown, Settings, LayoutDashboard, LogOut, ArrowLeft } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Coffees', href: '/coffees' },
  { name: 'About', href: 'http://localhost:3000/about' },
  { name: 'Contact', href: 'http://localhost:3000/contact' },
];

interface User {
  id: string;
  email?: string;
  user_metadata?: { full_name?: string; name?: string };
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isHomePage = pathname === '/';

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Check role from user_metadata or profiles table
        const role = session.user.user_metadata?.role || 'user';
        setUserRole(role);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setUserRole(session?.user?.user_metadata?.role ?? 'user');
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfileOpen(false);
    router.push('/');
    router.refresh();
  };

  const isTransparent = isHomePage && !scrolled;
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'U';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          isTransparent
            ? 'bg-transparent py-4'
            : 'bg-white/90 backdrop-blur-md shadow-sm py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className={`p-2 rounded-lg transition-colors duration-300 ${isTransparent ? 'bg-white/10' : 'bg-primary-50'}`}>
                <Coffee className={`h-6 w-6 transition-colors ${isTransparent ? 'text-amber-300' : 'text-primary-600'}`} />
              </div>
              <div>
                <span className={`block text-sm font-bold leading-none transition-colors ${isTransparent ? 'text-white' : 'text-neutral-900'}`}>
                  Highland Roots
                </span>
                <span className={`block text-xs leading-none transition-colors ${isTransparent ? 'text-amber-200' : 'text-primary-600'}`}>
                  Coffee Trading
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {/* Back to corporate */}
              <Link
                href="http://localhost:3000"
                className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                  isTransparent ? 'text-amber-200 hover:text-white' : 'text-primary-600 hover:text-primary-700'
                }`}
              >
                <ArrowLeft className="h-3 w-3" />
                Highland Roots HQ
              </Link>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-all duration-200 hover:scale-105 inline-block ${
                    pathname === link.href
                      ? isTransparent
                        ? 'text-white border-b-2 border-white pb-0.5'
                        : 'text-primary-700 border-b-2 border-primary-700 pb-0.5'
                      : isTransparent
                      ? 'text-white/90 hover:text-white'
                      : 'text-neutral-700 hover:text-primary-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Auth area */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 bg-primary-700 text-white rounded-full pl-1 pr-3 py-1 hover:bg-primary-800 transition-colors"
                  >
                    <div className="h-7 w-7 rounded-full bg-amber-400 flex items-center justify-center text-primary-900 font-bold text-sm">
                      {initial}
                    </div>
                    <span className="text-sm font-medium max-w-[100px] truncate">{userName}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-neutral-100 py-1 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-neutral-100">
                        <p className="text-sm font-bold text-neutral-900 truncate">{userName}</p>
                        <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                        <p className="text-xs text-primary-600 capitalize mt-0.5">{userRole === 'admin' ? 'Administrator' : 'Buyer Account'}</p>
                      </div>
                      {userRole === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                    isTransparent
                      ? 'bg-white text-primary-800 hover:bg-amber-50'
                      : 'bg-primary-700 text-white hover:bg-primary-800'
                  }`}
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-md"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen
                ? <X className={`h-6 w-6 ${isTransparent ? 'text-white' : 'text-neutral-700'}`} />
                : <Menu className={`h-6 w-6 ${isTransparent ? 'text-white' : 'text-neutral-700'}`} />
              }
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-neutral-100 shadow-lg">
            <div className="px-4 py-4 space-y-1">
              <Link
                href="http://localhost:3000"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-primary-600 rounded-md"
              >
                <ArrowLeft className="h-3 w-3" /> Highland Roots HQ
              </Link>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === link.href
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-neutral-100 mt-2">
                {user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm font-bold text-neutral-900">{userName}</p>
                      <p className="text-xs text-neutral-500">{user.email}</p>
                    </div>
                    {userRole === 'admin' && (
                      <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md">Admin Dashboard</Link>
                    )}
                    <Link href="/settings" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md">Settings</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">Log out</button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center bg-primary-700 text-white px-4 py-2 rounded-full text-sm font-bold"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
