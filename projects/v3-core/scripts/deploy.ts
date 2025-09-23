import { tryVerify } from '@qubeswap/common/verify'
import { ContractFactory } from 'ethers'
import { ethers, network } from 'hardhat'
import fs from 'fs'

type ContractJson = { abi: any; bytecode: string }
const artifacts: { [name: string]: ContractJson } = {
  // eslint-disable-next-line global-require
  QubeV3PoolDeployer: require('../artifacts/contracts/QubeV3PoolDeployer.sol/QubeV3PoolDeployer.json'),
  // eslint-disable-next-line global-require
  QubeV3Factory: require('../artifacts/contracts/QubeV3Factory.sol/QubeV3Factory.json'),
}

async function main() {
  const [owner] = await ethers.getSigners()
  const networkName = network.name
  console.log('owner', owner.address)

  let qubeV3PoolDeployer_address = ''
  let qubeV3PoolDeployer
  const QubeV3PoolDeployer = new ContractFactory(
    artifacts.QubeV3PoolDeployer.abi,
    artifacts.QubeV3PoolDeployer.bytecode,
    owner
  )
  if (!qubeV3PoolDeployer_address) {
    qubeV3PoolDeployer = await QubeV3PoolDeployer.deploy()

    qubeV3PoolDeployer_address = qubeV3PoolDeployer.address
    console.log('qubeV3PoolDeployer', qubeV3PoolDeployer_address)
  } else {
    qubeV3PoolDeployer = new ethers.Contract(
      qubeV3PoolDeployer_address,
      artifacts.QubeV3PoolDeployer.abi,
      owner
    )
  }

  let qubeV3Factory_address = ''
  let qubeV3Factory
  if (!qubeV3Factory_address) {
    const QubeV3Factory = new ContractFactory(
      artifacts.QubeV3Factory.abi,
      artifacts.QubeV3Factory.bytecode,
      owner
    )
    qubeV3Factory = await QubeV3Factory.deploy(qubeV3PoolDeployer_address)

    qubeV3Factory_address = qubeV3Factory.address
    console.log('qubeV3Factory', qubeV3Factory_address)
  } else {
    qubeV3Factory = new ethers.Contract(qubeV3Factory_address, artifacts.QubeV3Factory.abi, owner)
  }

  // Set FactoryAddress for qubeV3PoolDeployer.
  await qubeV3PoolDeployer.setFactoryAddress(qubeV3Factory_address);


  const contracts = {
    QubeV3Factory: qubeV3Factory_address,
    QubeV3PoolDeployer: qubeV3PoolDeployer_address,
  }

  fs.writeFileSync(`./deployments/${networkName}.json`, JSON.stringify(contracts, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
