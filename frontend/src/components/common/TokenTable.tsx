import { numFormatter, trimAndConcat } from '@/utils/helpers';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  TablePagination,
  TextField,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import { ZeroAddress } from 'ethers';
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';

interface Token {
  address: string;
  name: string;
  symbol: string;
  balance: string;
}

interface TokenTableProps {
  tokens: Token[];
  isFetching: boolean;
}

const TokenTable: React.FC<TokenTableProps> = ({ tokens, isFetching }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { chain } = useAccount();
  const nativeInfo = chain?.nativeCurrency;
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(isMobile ? 3 : 5);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    const isNativeTokenExist = !!tokens.filter(
      (token) => token.address == ZeroAddress
    ).length;
    let _tokens = tokens;
    if (nativeInfo?.symbol && nativeInfo?.name && isNativeTokenExist) {
      _tokens = tokens?.map((token) => {
        if (token.address == ZeroAddress) {
          return {
            ...token,
            symbol: nativeInfo?.symbol,
            name: nativeInfo?.name,
          };
        }
        return token;
      });
    }

    if (!searchQuery) return _tokens;
    const lowerQuery = searchQuery.toLowerCase();
    return _tokens.filter(
      (token) =>
        token.name.toLowerCase().includes(lowerQuery) ||
        token.symbol.toLowerCase().includes(lowerQuery) ||
        token.address.toLowerCase().includes(lowerQuery)
    );
  }, [tokens, searchQuery]);

  if (isFetching) {
    return <CircularProgress />;
  }

  // Slice tokens for pagination
  const paginatedTokens = filteredTokens.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (!tokens || !tokens.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 250,
          flex: 1,
          opacity: 0.5,
        }}
      >
        <Typography variant='h5' fontWeight={'bold'}>
          No Tokens Found!
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TextField
        label='Search by name, symbol or address'
        variant='outlined'
        fullWidth
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setPage(0);
        }}
        sx={{ mb: 2 }}
      />

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ mt: 2, overflowX: 'auto' }}
      >
        <Table
          sx={{ minWidth: isMobile ? 350 : 650 }}
          aria-label='ERC20 Tokens Table'
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell align='center'>
                <Typography variant='subtitle1' fontWeight='bold'>
                  Name
                </Typography>
              </TableCell>
              <TableCell align='center'>
                <Typography variant='subtitle1' fontWeight='bold'>
                  Symbol
                </Typography>
              </TableCell>
              <TableCell align='center'>
                <Typography variant='subtitle1' fontWeight='bold'>
                  Balance
                </Typography>
              </TableCell>
              <TableCell
                align='center'
                sx={{ display: isMobile ? 'none' : 'table-cell' }}
              >
                <Typography variant='subtitle1' fontWeight='bold'>
                  Address
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTokens.map((token) => (
              <TableRow key={token.address} hover>
                <TableCell align='center'>{token.name}</TableCell>
                <TableCell align='center'>{token.symbol}</TableCell>
                <TableCell align='center' sx={{ fontWeight: 'bold' }}>
                  {numFormatter(token.balance)}
                </TableCell>
                <TableCell
                  align='center'
                  sx={{
                    display: isMobile ? 'none' : 'table-cell',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                  }}
                >
                  <Tooltip title={token.address} placement='top'>
                    <span
                      style={{
                        display: 'block',
                        cursor: 'pointer',
                      }}
                    >
                      {trimAndConcat(token.address)}{' '}
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component='div'
          count={filteredTokens.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={isMobile ? [3, 5] : [5, 10, 25]}
        />
      </TableContainer>
    </>
  );
};

export default TokenTable;
