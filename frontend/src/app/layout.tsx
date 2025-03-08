import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import { AppProvider } from '@/components/AppProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jumper Echange Challenge',
  description: 'Signature Verification and ERC20 Token Dashboard',
};

export default function RootLayout({
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
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <AppProvider>
              <Header />
              {children}
              <Footer />
            </AppProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
