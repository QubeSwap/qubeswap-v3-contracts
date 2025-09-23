import { verifyContract } from '@qubeswap/common/verify'
import { sleep } from '@qubeswap/common/sleep'

async function main() {
  const networkName = network.name
  const deployedContracts = await import(`@qubeswap/v3-core/deployments/${networkName}.json`)

  // Verify QubeV3PoolDeployer
  console.log('Verify QubeV3PoolDeployer')
  await verifyContract(deployedContracts.QubeV3PoolDeployer)
  await sleep(10000)

  // Verify qubeV3Factory
  console.log('Verify qubeV3Factory')
  await verifyContract(deployedContracts.QubeV3Factory, [deployedContracts.QubeV3PoolDeployer])
  await sleep(10000)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
