import { abi as POOL_ABI } from '@qubeswap/v3-core/artifacts/contracts/QubeV3Pool.sol/QubeV3Pool.json'
import { Contract, Wallet } from 'ethers'
import { IQubeV3Pool } from '../../typechain-types'

export default function poolAtAddress(address: string, wallet: Wallet): IQubeV3Pool {
  return new Contract(address, POOL_ABI, wallet) as IQubeV3Pool
}
