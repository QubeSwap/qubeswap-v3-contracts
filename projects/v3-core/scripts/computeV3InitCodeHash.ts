import { ethers } from 'hardhat'
import QubeV3PoolArtifact from '../artifacts/contracts/QubeV3Pool.sol/QubeV3Pool.json'

const hash = ethers.utils.keccak256(QubeV3PoolArtifact.bytecode)
console.log(hash)
