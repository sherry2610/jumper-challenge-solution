'use client';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { fetchTokens } from '@/services/fetchTokens';
import { useToast } from '@/hooks/useToast';
import ToastNotification from './common/ToastNotification';

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
      {isFetching ? (
        <CircularProgress />
      ) : (
        <List>
          {data?.tokens?.map((token: any) => (
            <ListItem key={token.address}>
              <ListItemText
                primary={token.name}
                secondary={`${token.symbol} - Balance: ${token.balance}`}
              />
            </ListItem>
          ))}
        </List>
      )}

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
