import { Config, IDS, MangoClient } from "@blockworks-foundation/mango-client"
import { findTokenByMint } from "@m2-labs/token-amount"
import Decimal from "decimal.js"
import { ProtocolRates } from "../types"
import { asPublicKey } from "../utils"
import { asyncMap, compact } from "../utils/array-fns"
import { defaultConnection } from "../utils/connection"
import { buildAssetRate, buildProtocolRates } from "../utils/rate-fns"

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
  const rates = await asyncMap(groupConfig.tokens, async (t) => {
    const token = await findTokenByMint(t.mintKey)

    if (!token) {
      return
    }

    const tokenIndex = mangoGroup.getTokenIndex(t.mintKey)
    const borrowRate = mangoGroup.getBorrowRate(tokenIndex)
    const depositRate = mangoGroup.getDepositRate(tokenIndex)

    return buildAssetRate({
      token,
      deposit: new Decimal(depositRate.toNumber()),
      borrow: new Decimal(borrowRate.toNumber())
    })
  })

  return buildProtocolRates("mango", rates)
}
