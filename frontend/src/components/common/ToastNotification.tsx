import { Snackbar, Alert, Slide, SlideProps } from '@mui/material';

export interface ToastNotificationProps {
  open: boolean;
  message: string;
  severity?: 'error' | 'warning' | 'info' | 'success' | '';
  autoHideDuration?: number;
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  open,
  message,
  severity = 'success',
  autoHideDuration = 3500,
  onClose,
}) => {
  const Transition = (props: SlideProps) => (
    <Slide {...props} direction='down' />
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      TransitionComponent={Transition}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity || 'info'}
        sx={{
          width: '100%',
          fontWeight: 'bold',
          boxShadow: 3,
          borderRadius: 2,
          animation: 'fadeIn 0.5s ease-in-out',
          // You can add more custom styles here
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification;
