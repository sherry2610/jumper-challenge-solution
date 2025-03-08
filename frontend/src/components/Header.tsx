'use client';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import WalletConnector from './common/WalletConnector';

const StyledAppBar = styled(AppBar)({
  background: 'linear-gradient(45deg,rgb(99, 113, 248),rgb(163, 173, 230))',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
});

const Header = () => {
  return (
    <StyledAppBar position='static'>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          DASHBOARD
        </Typography>
        <WalletConnector />
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
