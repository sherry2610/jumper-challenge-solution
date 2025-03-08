import NoWalletFound from '@/components/common/NoWalletFound';
import TokenList from '@/components/TokenList';
import { Box, Container, Typography } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth='md'>
      <Box sx={{ my: 4 }}>
        <Typography variant='h3' align='center' gutterBottom>
          Signature Verification and ERC20 Token Dashboard
        </Typography>
        <NoWalletFound />
        <Box sx={{ mt: 4 }}>
          <TokenList />
        </Box>
      </Box>
    </Container>
  );
}
