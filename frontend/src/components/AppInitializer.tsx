'use client';
import { useRateLimit } from '@/contexts/RateLimitContext';
import { setupAxiosInterceptors } from '@/utils/setupAxiosInterceptors';
import { useEffect } from 'react';

// this will setup the interceptor using the context separately
const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const { setRateLimitReached } = useRateLimit();

  useEffect(() => {
    setupAxiosInterceptors(setRateLimitReached);
  }, [setRateLimitReached]);

  return <>{children}</>;
};

export default AppInitializer;
