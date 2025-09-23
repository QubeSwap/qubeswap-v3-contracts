import { ethers, network } from 'hardhat'
import { configs } from '@qubeswap/common/config'
import { tryVerify } from '@qubeswap/common/verify'
import fs from 'fs'
import { abi } from '@qubeswap/v3-core/artifacts/contracts/QubeV3Factory.sol/QubeV3Factory.json'

import { parseEther } from 'ethers/lib/utils'
const currentNetwork = network.name

async function main() {
  const [owner] = await ethers.getSigners()
  // Remember to update the init code hash in SC for different chains before deploying
  const networkName = network.name
  const config = configs[networkName as keyof typeof configs]
  if (!config) {
    throw new Error(`No config found for network ${networkName}`)
  }

  const v3DeployedContracts = await import(`@qubeswap/v3-core/deployments/${networkName}.json`)
  const mcV3DeployedContracts = await import(`@qubeswap/masterchef-v3/deployments/${networkName}.json`)

  const qubeV3Factory_address = v3DeployedContracts.QubeV3Factory

  const QubeV3LmPoolDeployer = await ethers.getContractFactory('QubeV3LmPoolDeployer')
  const qubeV3LmPoolDeployer = await QubeV3LmPoolDeployer.deploy(mcV3DeployedContracts.MasterChefV3)

  console.log('qubeV3LmPoolDeployer deployed to:', qubeV3LmPoolDeployer.address)

  const qubeV3Factory = new ethers.Contract(qubeV3Factory_address, abi, owner)

  await qubeV3Factory.setLmPoolDeployer(qubeV3LmPoolDeployer.address)

  const contracts = {
    QubeV3LmPoolDeployer: qubeV3LmPoolDeployer.address,
  }
  fs.writeFileSync(`./deployments/${networkName}.json`, JSON.stringify(contracts, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
