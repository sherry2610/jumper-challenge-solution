'use client';
import React, { useCallback, useEffect, useState } from 'react';
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
import axios from 'axios';
import ToastNotification from './common/ToastNotification';

const SIGN_MESSAGE = process.env.NEXT_PUBLIC_SIGN_MESSAGE;
type TOAST_DATA = {
  message: string;
  severity: 'success' | 'error' | '';
};

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
      onSuccess: (data: SignMessageData) => {
        console.log('Message signed!');
        // here we will Send the signature to verify for account creation
        verifyAccount({ address, signature: data });
      },
    },
  });

  const [mounted, setMounted] = useState(false);
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastPayload, setToastPayload] = useState<TOAST_DATA>({
    message: '',
    severity: '',
  });

  const verifyAccount = useCallback(
    async ({
      address,
      signature,
    }: {
      address: `0x${string}` | undefined;
      signature: string;
    }) => {
      await axios
        .post('/api/account/create', {
          address: `${address}`,
          signature,
        })
        .then((res) => {
          console.log('Account created successfully');
          if (res.data.message) {
            setToastPayload({
              message: res.data.message,
              severity: 'success',
            });

            handleShowToast();
          }
        })
        .catch((err) => {
          console.error('Error creating account', err);
          if (err.response.data.message) {
            setToastPayload({
              message: err.response.data.message,
              severity: 'error',
            });

            handleShowToast();
          }
        });
    },
    [address, signature]
  );

  const handleShowToast = () => {
    setToastOpen(true);
  };

  const handleCloseToast = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setToastOpen(false);
    setToastPayload({
      message: '',
      severity: '',
    });
  };

  // trigger the signmessage when the wallet is connected
  useEffect(() => {
    if (isConnected && !signature) {
      signMessage({ message: SIGN_MESSAGE || '' });
    }
  }, [isConnected, signature, signMessage]);

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

      <ToastNotification
        open={toastOpen}
        message={toastPayload.message}
        severity={toastPayload.severity}
        onClose={handleCloseToast}
      />
    </Box>
  );
};

export default AccountConnection;
