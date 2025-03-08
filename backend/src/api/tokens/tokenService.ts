import { env } from '@/common/utils/envConfig';
import axios from 'axios';
import { ethers, toBigInt, ZeroAddress } from 'ethers';

interface TokenTx {
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  value: string;
  from: string;
  to: string;
}

interface ERC20Token {
  address: string;
  name: string;
  symbol: string;
  balance: string;
}

type fetchERC20TokensResponse = { tokens: ERC20Token[] };

const apiKey = env.ETHERSCAN_API_KEY;
const baseUrl = 'https://api.etherscan.io/v2/api';

export const fetchERC20Tokens = async (userAddress: string, chainId: string): Promise<fetchERC20TokensResponse> => {
  try {
    if (!apiKey) {
      throw new Error('Missing ETHERSCAN_API_KEY in environment variables');
    }

    // Etherscan API to fetch token transactions
    const url = `${baseUrl}?chainid=${chainId}&module=account&action=tokentx&address=${userAddress}&sort=asc&apikey=${apiKey}`;

    const response = await axios.get(url);

    if (response.data.status !== '1' && response.data.message !== 'No transactions found') {
      throw new Error(response.data.message || 'Error fetching token transactions');
    }

    const transactions: TokenTx[] = response.data.result;

    if (!transactions.length) return { tokens: [] };

    // Arrange token balances by contract address
    const tokenMap: { [address: string]: { token: ERC20Token; rawBalance: bigint; decimals: number } } = {};

    for (const tx of transactions) {
      const contractAddress = tx.contractAddress;
      const decimals = parseInt(tx.tokenDecimal, 10);
      const value = toBigInt(tx.value);

      if (!tokenMap[contractAddress]) {
        tokenMap[contractAddress] = {
          token: {
            address: contractAddress,
            name: tx.tokenName,
            symbol: tx.tokenSymbol,
            balance: '0',
          },
          rawBalance: toBigInt(0),
          decimals,
        };
      }

      // If the user is the receiver, add balance otherwise subtract.
      if (tx.to.toLowerCase() === userAddress.toLowerCase()) {
        tokenMap[contractAddress].rawBalance = tokenMap[contractAddress].rawBalance + value;
      } else if (tx.from.toLowerCase() === userAddress.toLowerCase()) {
        tokenMap[contractAddress].rawBalance = tokenMap[contractAddress].rawBalance - value;
      }
    }

    // Prepare the final token list with formatted balance
    const tokens: ERC20Token[] = Object.values(tokenMap).map(({ token, rawBalance, decimals }) => {
      let raw = rawBalance;
      // if the calculated balance is in negative then consider it to be zero
      if (raw < 0n) {
        raw = 0n;
      }

      const balanceFormatted = ethers.formatUnits(raw, decimals);
      return { ...token, balance: balanceFormatted };
    });

    // Fetch native token balance (e.g., ETH)
    const nativeUrl = `${baseUrl}?chainid=${chainId}&module=account&action=balance&address=${userAddress}&tag=latest&apikey=${apiKey}`;
    const nativeResponse = await axios.get(nativeUrl);
    let nativeBalance = '0';
    if (nativeResponse.data.status === '1') {
      nativeBalance = ethers.formatEther(BigInt(nativeResponse.data.result));
    }

    const tokensWithNative: ERC20Token[] = [
      {
        name: 'Native Token',
        symbol: '-',
        address: ZeroAddress,
        balance: nativeBalance,
      },
      ...tokens,
    ].filter((token) => Number(token?.balance) !== 0);

    return { tokens: tokensWithNative };
  } catch (err) {
    console.log('error in fetching token...', err);
    return { tokens: [] };
  }
};
