'use client';
import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterContainer = styled(Box)({
  background: 'rgba(163, 173, 230, 0.5)',
  padding: '20px 0',
  marginTop: 'auto',
  borderTop: '1px solid #e0e0e0',
});

export default function Footer() {
  return (
    <FooterContainer>
      <Container maxWidth='md'>
        <Typography variant='body2' color='textSecondary' align='center'>
          © {new Date().getFullYear()} Jumper Exchange Challenge by Shaheryar.
        </Typography>
      </Container>
    </FooterContainer>
  );
}
