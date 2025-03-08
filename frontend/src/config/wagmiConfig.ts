import { http, createConfig } from 'wagmi';
import { bsc, bscTestnet, mainnet, polygon, sepolia } from 'wagmi/chains';

export const config = createConfig({
  chains: [mainnet, polygon, bsc, bscTestnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),

    // testnets
    [sepolia.id]: http(),
    [bscTestnet.id]: http(),
  },
});
