import { env } from '@/common/utils/envConfig';
import axios from 'axios';
import { ethers, toBigInt } from 'ethers';

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

const apiKey = env.ETHERSCAN_API_KEY;
const baseUrl = 'https://api.etherscan.io/v2/api';

export const fetchERC20Tokens = async (userAddress: string, chainId: string): Promise<ERC20Token[]> => {
  console.log('FETCHING START.... : ', userAddress);

  if (!apiKey) {
    throw new Error('Missing ETHERSCAN_API_KEY in environment variables');
  }

  // Etherscan API to fetch token transactions
  const url = `${baseUrl}?chainid=${chainId}&module=account&action=tokentx&address=${userAddress}&sort=asc&apikey=${apiKey}`;

  const response = await axios.get(url);
  console.log('response', response.data.message);

  if (response.data.status !== '1' && response.data.message !== 'No transactions found') {
    throw new Error(response.data.message || 'Error fetching token transactions');
  }

  const transactions: TokenTx[] = response.data.result;

  if (!transactions.length) return [];

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
    const balanceFormatted = ethers.formatUnits(rawBalance, decimals);
    return { ...token, balance: balanceFormatted };
  });

  return tokens;
};
