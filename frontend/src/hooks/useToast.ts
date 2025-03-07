import { useState } from 'react';
import { TOAST_DATA } from '@/components/types';

export const useToast = () => {
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastPayload, setToastPayload] = useState<TOAST_DATA>({
    message: '',
    severity: '',
  });

  const handleShowToast = ({ message, severity }: TOAST_DATA) => {
    setToastPayload({ message, severity });
    setToastOpen(true);
  };

  const handleCloseToast = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setToastOpen(false);
    setToastPayload({ message: '', severity: '' });
  };

  return { toastOpen, toastPayload, handleShowToast, handleCloseToast };
};
