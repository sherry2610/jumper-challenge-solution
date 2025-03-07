import { TOAST_DATA } from '@/components/types';
import axios from 'axios';

export const verifyAccount = async ({
  address,
  signature,
  responseCallback,
}: {
  address: `0x${string}` | undefined;
  signature: string;
  responseCallback: (toastData: TOAST_DATA) => void;
}) => {
  await axios
    .post('/api/account/create', {
      address: `${address}`,
      signature,
    })
    .then((res) => {
      if (res.data.message) {
        responseCallback({
          message: res.data.message,
          severity: 'success',
        });
      }
    })
    .catch((err) => {
      if (err.response.data.message) {
        responseCallback({
          message: err.response.data.message,
          severity: 'error',
        });
      }
    });
};
