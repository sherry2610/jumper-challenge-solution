'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface RateLimitContextType {
  isRateLimitReached: boolean;
  setRateLimitReached: (flag: boolean) => void;
}

const RateLimitContext = createContext<RateLimitContextType | undefined>(
  undefined
);

export const RateLimitProvider = ({ children }: { children: ReactNode }) => {
  const [isRateLimitReached, setIsRateLimitReached] = useState<boolean>(false);
  return (
    <RateLimitContext.Provider
      value={{ isRateLimitReached, setRateLimitReached: setIsRateLimitReached }}
    >
      {children}
    </RateLimitContext.Provider>
  );
};

export const useRateLimit = (): RateLimitContextType => {
  const context = useContext(RateLimitContext);
  if (!context) {
    throw new Error('useRateLimit must be used within a RateLimitProvider');
  }
  return context;
};
