import type { Metadata, Viewport } from 'next';
import { Outfit, Playfair_Display, Cairo } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DAHAB Grooming Lounge | Exclusive Barbershop & VIP Loyalty Club',
  description:
    'Experience premier men’s grooming, classic fades, and beard sculpting. Earn loyalty stamps with every visit and unlock complimentary haircuts and VIP gifts.',
  keywords: [
    'Barbershop',
    'Loyalty Program',
    'Dahab Barbershop',
    'Men Grooming',
    'Haircut Rewards',
    'Beard Sculpting',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable} ${cairo.variable} dark antialiased`}>
      <body className="min-h-screen bg-[#08080a] text-zinc-100 font-sans selection:bg-[#d4af37]/30 selection:text-amber-200">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
