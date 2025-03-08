'use client';
import { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { type SignMessageData } from 'wagmi/query';
import { trimAndConcat } from '@/utils/helpers';
import ToastNotification from './ToastNotification';
import { verifyAccount } from '@/services/verifyAccount';
import { useToast } from '@/hooks/useToast';
import { useAccountVerification } from '@/hooks/useAccountVerification';
import WalletConnectionButton from './WalletConnectionButton';

const SIGN_MESSAGE = process.env.NEXT_PUBLIC_SIGN_MESSAGE;

const AccountConnection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { address, isConnected } = useAccount();
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
    SIGN_MESSAGE || '',
    address as string
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
  if (!mounted) return <></>;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 2,
        flex: 1,
      }}
    >
      {((isConnected && !isMobile) ||
        (isConnected && !isMessageSignedDeclined)) && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {!isMobile && <Typography variant='h6'>Connected:</Typography>}

          <Tooltip title={address} placement='bottom'>
            <span
              style={{
                display: 'inline',
                cursor: 'pointer',
                fontWeight: 'bolder',
              }}
            >
              {trimAndConcat(address as string)}
            </span>
          </Tooltip>
        </Box>
      )}

      {isConnected && isMessageSignedDeclined && (
        <Button
          onClick={() => signMessage({ message: SIGN_MESSAGE || '' })}
          disabled={signLoading}
          variant='contained'
          sx={{
            minWidth: 30,
            fontSize: '0.8rem',
            padding: '5px 30px',
          }}
        >
          Verify
        </Button>
      )}

      {!isConnected ? (
        <WalletConnectionButton />
      ) : (
        <>
          <Button
            sx={{
              minWidth: 30,
              fontSize: '0.8rem',
              fontWeight: 'bold',
              display: 'flex',
              color: '#000',
              borderColor: '#000',
            }}
            variant='outlined'
            onClick={() => disconnect()}
            disabled={signLoading}
          >
            {signLoading ? (
              <span style={{ flex: 1, padding: '0px 30px' }}>
                <CircularProgress size={18} />
              </span>
            ) : (
              'Disconnect'
            )}
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
