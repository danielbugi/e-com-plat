"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Menu, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCartStore } from "@/store/cart-store";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ShopDropdown } from "./shop-dropdown";
import { AuthModal } from "@/components/auth/auth-modal";
import { useSettings } from "@/contexts/settings-context";
import { useLanguage } from "@/contexts/language-context";

export function Navbar() {
  const { data: session } = useSession();
  const { getTotalItems, toggleCart } = useCartStore();
  const { settings } = useSettings();
  const { t, direction } = useLanguage();
  const router = useRouter();
  const totalItems = getTotalItems();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav
          className="container flex h-16 items-center justify-between px-4"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2"
            aria-label={`${settings?.siteName || "FORGE & STEEL"} home`}
          >
            <Gem className="h-6 w-6 text-gold-600" aria-hidden="true" />
            <span className="font-bold text-xl">
              {settings?.siteName || "FORGE & STEEL"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div
            className="hidden md:flex items-center space-x-6"
            dir={direction}
          >
            <Link
              href="/"
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              {t("nav.home")}
            </Link>

            {/* Shop Dropdown */}
            <ShopDropdown />

            <Link
              href="/categories"
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              {t("nav.collections")}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              {t("nav.about")}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              {t("nav.contact")}
            </Link>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center space-x-2 flex-1 max-w-xs mx-6"
          >
            <div className="relative w-full">
              <label htmlFor="search" className="sr-only">
                {t("nav.search")}
              </label>
              <Search
                className={`absolute ${
                  direction === "rtl" ? "right-2.5" : "left-2.5"
                } top-2.5 h-4 w-4 text-muted-foreground pointer-events-none`}
                aria-hidden="true"
              />
              <Input
                id="search"
                type="search"
                placeholder={t("nav.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={direction === "rtl" ? "pr-8" : "pl-8"}
              />
            </div>
          </form>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <LanguageToggle />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={toggleCart}
              aria-label={`${t("nav.cart")} (${totalItems} items)`}
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold"
                  aria-label={`${totalItems} items in cart`}
                >
                  {totalItems}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="User menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user?.image || undefined}
                        alt={session.user?.name || "User"}
                      />
                      <AvatarFallback>
                        {session.user?.name?.[0] || "U"}
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
                    <Link href="/profile">{t("nav.profile")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">{t("nav.orders")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist">{t("nav.wishlist")}</Link>
                  </DropdownMenuItem>
                  {session.user.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">{t("nav.admin")}</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    {t("nav.signout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setIsAuthModalOpen(true)}>
                {t("nav.signin")}
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4 mt-6">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="mb-4">
                    <div className="relative">
                      <Search
                        className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <Input
                        type="search"
                        placeholder={t("nav.search")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </form>

                  <Link href="/" className="text-lg font-medium">
                    {t("nav.home")}
                  </Link>
                  <Link href="/shop" className="text-lg font-medium">
                    {t("nav.shop")}
                  </Link>
                  <Link href="/categories" className="text-lg font-medium">
                    {t("nav.collections")}
                  </Link>
                  <Link href="/about" className="text-lg font-medium">
                    {t("nav.about")}
                  </Link>
                  <Link href="/contact" className="text-lg font-medium">
                    {t("nav.contact")}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
