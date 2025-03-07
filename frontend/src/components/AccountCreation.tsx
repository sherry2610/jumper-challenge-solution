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
import ToastNotification from './common/ToastNotification';
import { verifyAccount } from '@/services/verifyAccount';
import { useToast } from '@/hooks/useToast';
import { useAccountVerification } from '@/hooks/useAccountVerification';

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
      onSuccess: (data: SignMessageData) => {
        setIsMessageSignedDeclined(false);
        // here we will Send the signature to verify for account creation
        verifyAccount({
          address,
          signature: data,
          responseCallback: handleShowToast,
        });
      },
    },
  });

  const { toastOpen, toastPayload, handleShowToast, handleCloseToast } =
    useToast();

  const [isMessageSignedDeclined, setIsMessageSignedDeclined] =
    useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // trigger the signmessage  when the wallet is connected and if the session is expired
  useAccountVerification(
    isConnected,
    signature,
    signMessage,
    SIGN_MESSAGE || ''
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // handle the case when signmessage fails due to connector
  // not initialised or user rejected the signmessage popup
  useEffect(() => {
    if (
      signError &&
      signError?.message?.includes('getChainId is not a function')
    ) {
      signMessage({ message: SIGN_MESSAGE || '' });
    } else if (
      signError &&
      signError?.message?.includes('User rejected the request.')
    ) {
      handleShowToast({
        message: 'User rejected the request.',
        severity: 'error',
      });

      // this will show a cta (Verify Account) to sign message again
      // if user decided to cancel the signmessage popup
      setIsMessageSignedDeclined(true);

      setTimeout(() => {
        //   this is only to notify the user
        handleShowToast({
          message: 'Please verify your account by signing the message.',
          severity: 'info',
        });
      }, 4000);
    }
  }, [signError]);

  // just to remove hydration mismatch warning
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
      {isMessageSignedDeclined && (
        <Box>
          <Button
            onClick={() => signMessage({ message: SIGN_MESSAGE || '' })}
            disabled={signLoading}
            variant='contained'
          >
            Verify Account
          </Button>
        </Box>
      )}

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
