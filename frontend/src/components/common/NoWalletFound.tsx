'use client';
import { Alert } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useConnect } from 'wagmi';

const NoWalletFound = () => {
  const { connectors } = useConnect();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <></>;

  return (
    <>
      {connectors && !connectors?.length && (
        <Alert severity='info'>
          No wallet found. Please install a compatible EVM wallet extension like{' '}
          <Link
            target='_blank'
            href='https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'
          >
            MetaMask.
          </Link>
        </Alert>
      )}
    </>
  );
};

export default NoWalletFound;
