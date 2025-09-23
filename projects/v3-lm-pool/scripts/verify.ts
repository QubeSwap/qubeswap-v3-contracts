import { verifyContract } from '@qubeswap/common/verify'
import { sleep } from '@qubeswap/common/sleep'
import { configs } from '@qubeswap/common/config'

async function main() {
  const networkName = network.name
  const config = configs[networkName as keyof typeof configs]

  if (!config) {
    throw new Error(`No config found for network ${networkName}`)
  }
  const deployedContracts_masterchef_v3 = await import(`@qubeswap/masterchef-v3/deployments/${networkName}.json`)
  const deployedContracts_v3_lm_pool = await import(`@qubeswap/v3-lm-pool/deployments/${networkName}.json`)

  // Verify qubeV3LmPoolDeployer
  console.log('Verify qubeV3LmPoolDeployer')
  await verifyContract(deployedContracts_v3_lm_pool.QubeV3LmPoolDeployer, [
    deployedContracts_masterchef_v3.MasterChefV3,
  ])
  await sleep(10000)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
