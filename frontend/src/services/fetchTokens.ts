import axios from 'axios';

export const fetchTokens = async (userAddress: string, chainId: string) => {
  return await axios.get(`/api/tokens/${chainId}/${userAddress}`);
};
