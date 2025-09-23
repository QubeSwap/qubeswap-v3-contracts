import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import { MockTimeQubeV3Pool } from '../../typechain-types/contracts/test/MockTimeQubeV3Pool'
import { TestERC20 } from '../../typechain-types/contracts/test/TestERC20'
import { QubeV3Factory } from '../../typechain-types/contracts/QubeV3Factory'
import { QubeV3PoolDeployer } from '../../typechain-types/contracts/QubeV3PoolDeployer'
import { TestQubeV3Callee } from '../../typechain-types/contracts/test/TestQubeV3Callee'
import { TestQubeV3Router } from '../../typechain-types/contracts/test/TestQubeV3Router'
import { MockTimeQubeV3PoolDeployer } from '../../typechain-types/contracts/test/MockTimeQubeV3PoolDeployer'
import QubeV3LmPoolArtifact from '@qubeswap/v3-lm-pool/artifacts/contracts/QubeV3LmPool.sol/QubeV3LmPool.json'

import { Fixture } from 'ethereum-waffle'

interface FactoryFixture {
  factory: QubeV3Factory
}

interface DeployerFixture {
  deployer: QubeV3PoolDeployer
}

async function factoryFixture(): Promise<FactoryFixture> {
  const { deployer } = await deployerFixture()
  const factoryFactory = await ethers.getContractFactory('QubeV3Factory')
  const factory = (await factoryFactory.deploy(deployer.address)) as QubeV3Factory
  return { factory }
}
async function deployerFixture(): Promise<DeployerFixture> {
  const deployerFactory = await ethers.getContractFactory('QubeV3PoolDeployer')
  const deployer = (await deployerFactory.deploy()) as QubeV3PoolDeployer
  return { deployer }
}

interface TokensFixture {
  token0: TestERC20
  token1: TestERC20
  token2: TestERC20
}

async function tokensFixture(): Promise<TokensFixture> {
  const tokenFactory = await ethers.getContractFactory('TestERC20')
  const tokenA = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenB = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenC = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20

  const [token0, token1, token2] = [tokenA, tokenB, tokenC].sort((tokenA, tokenB) =>
    tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? -1 : 1
  )

  return { token0, token1, token2 }
}

type TokensAndFactoryFixture = FactoryFixture & TokensFixture

interface PoolFixture extends TokensAndFactoryFixture {
  swapTargetCallee: TestQubeV3Callee
  swapTargetRouter: TestQubeV3Router
  createPool(
    fee: number,
    tickSpacing: number,
    firstToken?: TestERC20,
    secondToken?: TestERC20
  ): Promise<MockTimeQubeV3Pool>
}

// Monday, October 5, 2020 9:00:00 AM GMT-05:00
export const TEST_POOL_START_TIME = 1601906400

export const poolFixture: Fixture<PoolFixture> = async function (): Promise<PoolFixture> {
  const { factory } = await factoryFixture()
  const { token0, token1, token2 } = await tokensFixture()

  const MockTimeQubeV3PoolDeployerFactory = await ethers.getContractFactory('MockTimeQubeV3PoolDeployer')
  const MockTimeQubeV3PoolFactory = await ethers.getContractFactory('MockTimeQubeV3Pool')

  const calleeContractFactory = await ethers.getContractFactory('TestQubeV3Callee')
  const routerContractFactory = await ethers.getContractFactory('TestQubeV3Router')

  const swapTargetCallee = (await calleeContractFactory.deploy()) as TestQubeV3Callee
  const swapTargetRouter = (await routerContractFactory.deploy()) as TestQubeV3Router

  const QubeV3LmPoolFactory = await ethers.getContractFactoryFromArtifact(QubeV3LmPoolArtifact)

  return {
    token0,
    token1,
    token2,
    factory,
    swapTargetCallee,
    swapTargetRouter,
    createPool: async (fee, tickSpacing, firstToken = token0, secondToken = token1) => {
      const mockTimePoolDeployer =
        (await MockTimeQubeV3PoolDeployerFactory.deploy()) as MockTimeQubeV3PoolDeployer
      const tx = await mockTimePoolDeployer.deploy(
        factory.address,
        firstToken.address,
        secondToken.address,
        fee,
        tickSpacing
      )

      const receipt = await tx.wait()
      const poolAddress = receipt.events?.[0].args?.pool as string

      const mockTimeQubeV3Pool = MockTimeQubeV3PoolFactory.attach(poolAddress) as MockTimeQubeV3Pool

      await (
        await factory.setLmPool(
          poolAddress,
          (
            await QubeV3LmPoolFactory.deploy(
              poolAddress,
              ethers.constants.AddressZero,
              Math.floor(Date.now() / 1000)
            )
          ).address
        )
      ).wait()

      return mockTimeQubeV3Pool
    },
  }
}
