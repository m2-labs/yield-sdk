import { Config, IDS, MangoClient } from "@blockworks-foundation/mango-client"
import { findTokenByMint } from "@m2-labs/token-amount"
import Decimal from "decimal.js"
import { asPublicKey } from "../utils"
import { fetchHandler } from "../utils/fetch-fns"
import { buildAssetRate } from "../utils/rate-fns"

export const fetch = fetchHandler(
  "mango",
  async ({ connection, isDesiredToken }) => {
    const cluster = "mainnet"
    const group = "mainnet.1"
    const config = new Config(IDS)
    const groupConfig = config.getGroup(cluster, group)

    if (!groupConfig) {
      throw new Error(
        `Unable to find Mango group config for ${cluster}.${group}`
      )
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
    const rates = groupConfig.tokens.map((t) => {
      const token = findTokenByMint(t.mintKey)

      if (!token) {
        return
      }

      if (isDesiredToken(token)) {
        const tokenIndex = mangoGroup.getTokenIndex(t.mintKey)
        const borrowRate = mangoGroup.getBorrowRate(tokenIndex)
        const depositRate = mangoGroup.getDepositRate(tokenIndex)

        return buildAssetRate({
          token,
          deposit: new Decimal(depositRate.toNumber()),
          borrow: new Decimal(borrowRate.toNumber())
        })
      }
    })

    return rates
  }
)
