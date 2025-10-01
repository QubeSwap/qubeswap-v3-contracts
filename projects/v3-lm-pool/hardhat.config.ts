import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@typechain/hardhat'
import 'dotenv/config'
import { NetworkUserConfig } from 'hardhat/types'
import 'solidity-docgen';
require('dotenv').config({ path: require('find-config')('.env') })

const bscTestnet: NetworkUserConfig = {
  url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  chainId: 97,
  accounts: [process.env.KEY_TESTNET!],
}

const bscMainnet: NetworkUserConfig = {
  url: 'https://bsc-dataseed.binance.org/',
  chainId: 56,
  accounts: [process.env.KEY_MAINNET!],
}

const eth: NetworkUserConfig = {
  url: 'https://eth.llamarpc.com',
  chainId: 1,
  accounts: [process.env.KEY_ETH!],
}

const ticsMainnet: NetworkUserConfig = {
  url: 'https://rpc.qubetics.com/',
  chainId: 9030,
  accounts: [process.env.KEY_MAINNET!],
}

const config: HardhatUserConfig = {
  solidity: {
    version: '0.7.6',
  },
  networks: {
    hardhat: {},
    ...(process.env.KEY_TESTNET && { bscTestnet }),
    ...(process.env.KEY_MAINNET && { bscMainnet }),
	...(process.env.KEY_MAINNET && { ticsMainnet }),
    ...(process.env.KEY_ETH && { eth }),
  },
  etherscan: {
    apiKey: {
      ticsMainnet: "process.env.ETHERSCAN_API_KEY", // Etherscan API key for your custom chain
    },
    customChains: [
      {
        network: "ticsMainnet", // Must match the network name in `apiKey`
        chainId: 9030,
        urls: {
          apiURL: "https://evm-api.qubetics.com/", // Etherscan-compatible API URL for verification
          browserURL: "https://ticsscan.com/", // Etherscan-compatible browser URL
        },
      },
    ],
  },
  paths: {
    sources: './contracts/',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
}

export default config
