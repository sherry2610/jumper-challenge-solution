'use client';
import NoWalletFound from '@/components/common/NoWalletFound';
import TokenList from '@/components/TokenList';
import { useRateLimit } from '@/contexts/RateLimitContext';
import { Box, Container, Typography } from '@mui/material';

export default function Home() {
  const { isRateLimitReached } = useRateLimit();

  // Fallback UI for our server's api rate limit error
  if (isRateLimitReached) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1>Too Many Requests</h1>
        <p>Please try again later by refreshing the page.</p>
      </Box>
    );
  }

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
