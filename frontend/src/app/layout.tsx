import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import { AppProvider } from '@/components/AppProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RateLimitProvider } from '@/contexts/RateLimitContext';
import AppInitializer from '@/components/AppInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jumper Echange Challenge',
  description: 'Signature Verification and ERC20 Token Dashboard',
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={inter.className}
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <RateLimitProvider>
          <AppInitializer>
            <AppRouterCacheProvider>
              <ThemeProvider theme={theme}>
                <AppProvider>
                  <Header />
                  {children}
                  <Footer />
                </AppProvider>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </AppInitializer>
        </RateLimitProvider>
      </body>
    </html>
  );
}

export default RootLayout;
