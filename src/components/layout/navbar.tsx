'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Menu, Gem, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCartStore } from '@/store/cart-store';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { ShopDropdown } from './shop-dropdown';
import { AuthModal } from '@/components/auth/auth-modal';
import { useSettings } from '@/contexts/settings-context';
import { useLanguage } from '@/contexts/language-context';

export function Navbar() {
  const { data: session } = useSession();
  const { getTotalItems, toggleCart } = useCartStore();
  const { settings } = useSettings();
  const { t, direction } = useLanguage();
  const router = useRouter();
  const totalItems = getTotalItems();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-steel-900 shadow-lg">
        <nav
          className="container flex h-24 items-center justify-between px-4  md:px-6"
          aria-label="Main navigation"
        >
          {/* Left Side - Menu Links (Desktop) */}
          <div
            className="hidden lg:flex items-center gap-8 flex-1"
            dir={direction}
          >
            <Link
              href="/"
              className="text-white/90 hover:text-white text-sm font-medium transition-colors relative group"
            >
              {t('nav.home')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 transition-all group-hover:w-full"></span>
            </Link>

            <ShopDropdown />

            <Link
              href="/categories"
              className="text-white/90 hover:text-white text-sm font-medium transition-colors relative group"
            >
              {t('nav.collections')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 transition-all group-hover:w-full"></span>
            </Link>

            <Link
              href="/about"
              className="text-white/90 hover:text-white text-sm font-medium transition-colors relative group"
            >
              {t('nav.about')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 transition-all group-hover:w-full"></span>
            </Link>

            <Link
              href="/contact"
              className="text-white/90 hover:text-white text-sm font-medium transition-colors relative group"
            >
              {t('nav.contact')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* Center - Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0"
            aria-label={`${settings?.siteName || 'FORGE & STEEL'} home`}
          >
            {/* <Gem className="h-8 w-8 text-white" aria-hidden="true" /> */}
            <div className="flex flex-col justify-center items-center ">
              <h3 className="font-sans text-xxl text-white tracking-wide">
                {settings?.siteName || 'FORGE & STEEL'}
              </h3>
            </div>
          </Link>

          {/* Right Side - Icons */}
          <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
            {/* Search Toggle - Desktop */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-white/90 hover:text-white hover:bg-white/10"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </Button>

            {/* Language Toggle */}
            <div className="hidden md:block">
              <LanguageToggle />
            </div>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white/90 hover:text-white hover:bg-white/10"
              onClick={toggleCart}
              aria-label={`${t('nav.cart')} (${totalItems} items)`}
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold-500 text-white text-xs flex items-center justify-center font-bold shadow-lg"
                  aria-label={`${totalItems} items in cart`}
                >
                  {totalItems}
                </span>
              )}
            </Button>

            {/* User Menu - Desktop */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hidden md:flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-white/90 hover:text-white hover:bg-white/10"
                    aria-label="User menu"
                  >
                    <Avatar className="h-8 w-8 border-2 border-gold-400">
                      <AvatarImage
                        src={session.user?.image || undefined}
                        alt={session.user?.name || 'User'}
                      />
                      <AvatarFallback className="bg-gold-500 text-white">
                        {session.user?.name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">{t('nav.profile')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">{t('nav.orders')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist">{t('nav.wishlist')}</Link>
                  </DropdownMenuItem>
                  {session.user.role === 'ADMIN' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">{t('nav.admin')}</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    {t('nav.signout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:flex bg-gold-500 hover:bg-gold-600 text-white"
                size="sm"
              >
                {t('nav.signin')}
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-white/90 hover:text-white hover:bg-white/10"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] bg-gradient-luxury border-l border-white/10"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <Gem className="h-6 w-6 text-gold-400" />
                      <span className="font-serif font-bold text-white">
                        {settings?.siteName || 'FORGE & STEEL'}
                      </span>
                    </div>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/90 hover:text-white"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60"
                        aria-hidden="true"
                      />
                      <Input
                        type="search"
                        placeholder={t('nav.search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>
                  </form>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-1 flex-1">
                    <Link
                      href="/"
                      className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors text-base font-medium"
                    >
                      {t('nav.home')}
                    </Link>
                    <Link
                      href="/shop"
                      className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors text-base font-medium"
                    >
                      {t('nav.shop')}
                    </Link>
                    <Link
                      href="/categories"
                      className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors text-base font-medium"
                    >
                      {t('nav.collections')}
                    </Link>
                    <Link
                      href="/about"
                      className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors text-base font-medium"
                    >
                      {t('nav.about')}
                    </Link>
                    <Link
                      href="/contact"
                      className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors text-base font-medium"
                    >
                      {t('nav.contact')}
                    </Link>

                    {session ? (
                      <>
                        <div className="border-t border-white/10 my-4"></div>
                        <Link
                          href="/profile"
                          className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors text-base font-medium"
                        >
                          {t('nav.profile')}
                        </Link>
                        <Link
                          href="/orders"
                          className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors text-base font-medium"
                        >
                          {t('nav.orders')}
                        </Link>
                        {session.user.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors text-base font-medium"
                          >
                            {t('nav.admin')}
                          </Link>
                        )}
                      </>
                    ) : null}
                  </nav>

                  {/* Mobile Footer Actions */}
                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <LanguageToggle />

                    {session ? (
                      <Button
                        onClick={() => signOut()}
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10"
                      >
                        {t('nav.signout')}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setIsAuthModalOpen(true);
                        }}
                        className="w-full bg-gold-500 hover:bg-gold-600 text-white"
                      >
                        {t('nav.signin')}
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>

        {/* Desktop Search Bar - Expandable */}
        {showSearch && (
          <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="container px-4 md:px-6 py-4">
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60"
                    aria-hidden="true"
                  />
                  <Input
                    type="search"
                    placeholder={t('nav.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 text-base"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                    onClick={() => setShowSearch(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
