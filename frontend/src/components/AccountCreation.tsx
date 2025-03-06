'use client';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { type SignMessageData, type SignMessageVariables } from 'wagmi/query';
import { trimAndConcat } from '@/utils/helpers';

const SIGN_MESSAGE = process.env.NEXT_PUBLIC_SIGN_MESSAGE;

const AccountConnection = () => {
  const { address, isConnected } = useAccount();
  const {
    connect,
    connectors,
    error: connectError,
    isPending: connectLoading,
  } = useConnect();

  const { disconnect } = useDisconnect();
  const {
    signMessage,
    data: signature,
    isPending: signLoading,
    error: signError,
  } = useSignMessage({
    mutation: {
      onSuccess: async (
        data: SignMessageData,
        variables: SignMessageVariables
      ) => {
        console.log('Message signed!');
        // here we will Send the signature to the backend for account creation
      },
    },
  });

  // trigger the signmessage when the wallet is connected
  useEffect(() => {
    if (isConnected && !signature) {
      signMessage({ message: SIGN_MESSAGE || '' });
    }
  }, [isConnected, signature, signMessage]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // just to ignore hydration mismatch warning
  if (!mounted) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant='h6'>Connect your Wallet</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography variant='h6'>
        {!isConnected
          ? 'Connect your Wallet'
          : `Wallet Connected: ${trimAndConcat(address as string)}`}
      </Typography>

      {!isConnected ? (
        <>
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              onClick={() => connect({ connector })}
              disabled={connectLoading}
              variant='contained'
            >
              {connector.name}
              {connectLoading && ' (connecting)'}
            </Button>
          ))}
          {connectError && (
            <Alert severity='error'>{connectError.message}</Alert>
          )}
        </>
      ) : (
        <>
          {signError && (
            <Alert severity='error'>
              Signature Error : {signError.message}
            </Alert>
          )}
          <Button variant='outlined' onClick={() => disconnect()}>
            {signLoading ? <CircularProgress /> : 'Disconnect Wallet'}
          </Button>
        </>
      )}
    </Box>
  );
};

export default AccountConnection;
