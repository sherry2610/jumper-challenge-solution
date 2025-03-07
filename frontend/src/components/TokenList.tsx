'use client';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import { fetchTokens } from '@/services/fetchTokens';
import { useToast } from '@/hooks/useToast';
import ToastNotification from './common/ToastNotification';
import TokenTable from './common/TokenTable';

const TokenList = () => {
  const { toastOpen, toastPayload, handleShowToast, handleCloseToast } =
    useToast();

  const { address, isConnected, chainId } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, error, refetch, isFetching } = useQuery({
    queryKey: ['tokens', address],
    queryFn: async () => {
      return await fetchTokens(address!, chainId!.toString())
        .then((res) => {
          handleShowToast({
            message: 'Tokens fetched successfully!',
            severity: 'success',
          });
          return res?.data?.responseObject
            ? { ...res?.data?.responseObject, success: true }
            : { tokens: [], success: true };
        })
        .catch((err) => {
          handleShowToast({
            message: err.response.data.message,
            severity: 'error',
          });
          return { tokens: [], success: false };
        });
    },
    enabled: !!address,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (chainId && address) {
      refetch();
    }
  }, [chainId, address]);

  if (!mounted) {
    return null;
  }

  if (!isConnected) {
    return (
      <Typography variant='h6'>
        Please connect your wallet to view tokens.
      </Typography>
    );
  }

  if (error)
    return <Typography color='error'>Error fetching tokens</Typography>;

  return (
    <Box>
      <Typography variant='h6'>ERC20 Tokens</Typography>
      <TokenTable tokens={data?.tokens || []} isFetching={isFetching} />

      <ToastNotification
        open={toastOpen}
        message={toastPayload.message}
        severity={toastPayload.severity}
        onClose={handleCloseToast}
      />
    </Box>
  );
};

export default TokenList;
