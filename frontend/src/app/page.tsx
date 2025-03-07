import AccountConnection from '@/components/AccountCreation';
import TokenList from '@/components/TokenList';
import { Box, Container, Typography } from '@mui/material';
import Image from 'next/image';

export default function Home() {
  return (
    <Container maxWidth='md'>
      <Box sx={{ my: 4 }}>
        <Box display='flex' justifyContent='center'>
          <Typography variant='h1'>Welcome to Jumper challenge!</Typography>
        </Box>

        <Typography variant='h3' align='center' gutterBottom>
          Wallet Auth and ERC20 Token Dashboard
        </Typography>
        <AccountConnection />
        <Box sx={{ mt: 4 }}>
          <TokenList />
        </Box>
      </Box>
    </Container>
  );
}
