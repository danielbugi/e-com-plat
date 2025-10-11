import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import './globals.css';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CartSheet } from '@/components/cart/cart-sheet';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SettingsProvider } from '@/contexts/settings-context';
import { LanguageProvider } from '@/contexts/language-context';
import { Toaster } from 'react-hot-toast';

// Playfair Display - Heading Font
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: "Forge & Steel - Premium Men's Jewelry",
  description:
    'Handcrafted rings and jewelry designed for the modern gentleman',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Import BBH Sans Bogle from Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* <link
          href="https://fonts.googleapis.com/css2?family=BBH+Sans+Bogle:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        /> */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={playfair.variable}
        style={{ fontFamily: "'Rubik', system-ui, sans-serif" }}
      >
        <ThemeProvider defaultTheme="light" storageKey="jewelry-theme">
          <AuthProvider>
            <LanguageProvider>
              <SettingsProvider>
                {/* Skip to content link for accessibility */}
                <a href="#main-content" className="skip-to-content">
                  Skip to main content
                </a>

                <div className="flex min-h-screen flex-col">
                  <AnnouncementBar />
                  <Navbar />
                  <main id="main-content" className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
                <CartSheet />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: 'hsl(var(--card))',
                      color: 'hsl(var(--card-foreground))',
                      border: '1px solid hsl(var(--border))',
                    },
                  }}
                />
              </SettingsProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
