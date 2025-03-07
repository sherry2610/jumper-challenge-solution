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
  SIGN_MESSAGE: string,
  address: string
): void => {
  useEffect(() => {
    (async () => {
      if (isConnected) {
        const isSessionExpired = await checkSession(address);
        console.log('isSessionExpired', isSessionExpired);
        if (!signature && !isSessionExpired.valid) {
          console.log('running sign');
          signMessage({ message: SIGN_MESSAGE });
        }
      }
    })();
  }, [isConnected, signature, signMessage, SIGN_MESSAGE, address]);
};
