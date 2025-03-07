import { useEffect, useRef } from 'react';
import { checkSession } from '@/services/checkSession';

/* 

This hook is doing the following :

 - Check if the wallet is connected and if yes then
 - checks whether the session is expired or not and if it is only then 
 - it triggers the signMessage function in order to verify the account

*/

export const useAccountVerification = (
  isConnected: boolean,
  signature: string | undefined,
  signMessage: (params: { message: string }) => void,
  SIGN_MESSAGE: string
): void => {
  const sessionCheckedRef = useRef(false);
  useEffect(() => {
    (async () => {
      if (isConnected && !sessionCheckedRef.current) {
        sessionCheckedRef.current = true;
        const isSessionExpired = await checkSession();
        if (!signature && !isSessionExpired.valid) {
          signMessage({ message: SIGN_MESSAGE });
        }
      }
    })();
  }, [isConnected, signature, signMessage, SIGN_MESSAGE]);
};
