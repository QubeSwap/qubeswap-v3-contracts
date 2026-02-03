import type { HardhatUserConfig, NetworkUserConfig } from 'hardhat/types'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-watcher'
import 'dotenv/config'
import 'solidity-docgen'

require('dotenv').config({ path: require('find-config')('.env') })

const LOW_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 2_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const LOWEST_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 400,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const DEFAULT_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 1_000_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    // Mainnets
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    localhost: { timeout: 600000 },
    seiMainnet: {
      url: "https://evm-rpc.sei-apis.com",
      accounts: [process.env.KEY_MAINNET!]
    },
	monadMainnet: {
      url: "https://rpc.monad.xyz",
      accounts: [process.env.KEY_MAINNET!]
    },
	ticsMainnet: {
      url: "https://rpc.qubetics.com",
      accounts: [process.env.KEY_MAINNET!]
    },
	bscMainnet: {
      url: "https://bsc-dataseed.binance.org",
      accounts: [process.env.KEY_MAINNET!]
    },
	avaxMainnet: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      accounts: [process.env.KEY_MAINNET!]
    },
  },	
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || '',
    customChains: [
	  {
        network: 'sei',
        chainId: 1329,
        urls: {
          apiURL: process.env.SEI_API_ENDPOINT || '',
          browserURL: process.env.SEI_EXPLORER || ''
        }
      },
	  {
        network: 'monad',
        chainId: 143,
        urls: {
          apiURL: process.env.MONAD_API_ENDPOINT || '',
          browserURL: process.env.MONAD_EXPLORER || ''
        }
      },
	  {
        network: "qubetics",
        chainId: 9030,
        urls: {
          apiURL: process.env.QUBETICS_API_ENDPOINT || '',
          browserURL: process.env.QUBETICS_EXPLORER || ''
        }
      },
	  {
        network: 'bsc',
        chainId: 56,
        urls: {
          apiURL: process.env.BSC_API_ENDPOINT || '',
          browserURL: process.env.BSC_EXPLORER || ''
        }
      },
	  {
        network: 'avalanche',
        chainId: 43114,
        urls: {
          apiURL: process.env.AVALANCHE_API_ENDPOINT || '',
          browserURL: process.env.AVALANCHE_EXPLORER || ''
        }
      }
    ]
  },
  solidity: {
    compilers: [DEFAULT_COMPILER_SETTINGS],
    overrides: {
      'contracts/QubeV3Pool.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/QubeV3PoolDeployer.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/test/OutputCodeHash.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
    },
  },
  watcher: {
    test: {
      tasks: [{ command: 'test', params: { testFiles: ['{path}'] } }],
      files: ['./test/**/*'],
      verbose: true,
    },
  },
  docgen: {
    pages: 'files',
  },
}
