import { Config, IDS, MangoClient } from "@blockworks-foundation/mango-client"
import { PublicKey } from "@solana/web3.js"
import Decimal from "decimal.js"
import { findTokenByMint } from "../tokens"
import { AssetRate, ProtocolRates } from "../types"
import { asPublicKey } from "../utils"
import { defaultConnection } from "../utils/connection"

export const fetch = async (
  connection = defaultConnection("mango")
): Promise<ProtocolRates> => {
  const cluster = "mainnet"
  const group = "mainnet.1"
  const config = new Config(IDS)
  const groupConfig = config.getGroup(cluster, group)

  if (!groupConfig) {
    throw new Error(`Unable to find Mango group config for ${cluster}.${group}`)
  }

  const clusterData = IDS.groups.find((g) => {
    return g.name == group && g.cluster == cluster
  })

  if (!clusterData?.mangoProgramId) {
    throw new Error("Could not find mango program id")
  }

  const client = new MangoClient(
    connection,
    asPublicKey(clusterData.mangoProgramId)
  )
  const mangoGroup = await client.getMangoGroup(groupConfig.publicKey)
  await mangoGroup.loadRootBanks(connection)
  const rates: AssetRate[] = []

  groupConfig.tokens.forEach((t) => {
    const token = findTokenByMint(t.mintKey)

    if (!token) {
      return
    }

    const tokenIndex = mangoGroup.getTokenIndex(t.mintKey)
    const borrowRate = mangoGroup.getBorrowRate(tokenIndex)
    const depositRate = mangoGroup.getDepositRate(tokenIndex)

    rates.push({
      asset: token.symbol,
      mint: new PublicKey(token.mint),
      deposit: new Decimal(depositRate.toNumber()),
      borrow: new Decimal(borrowRate.toNumber())
    })
  })

  return {
    protocol: "mango",
    rates
  }
}
