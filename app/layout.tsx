import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Crypto Tracker',
  description: 'Track top 20 cryptocurrencies and simulate your portfolio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Toaster position="top-right" richColors />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="container mx-auto px-4 py-6">{children}</main>
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}