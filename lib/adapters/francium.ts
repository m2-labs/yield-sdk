import { findTokenBySymbol } from "@m2-labs/token-amount"
import { Connection, PublicKey } from "@solana/web3.js"
import Decimal from "decimal.js"
import FranciumSDK from "francium-sdk"
import { ProtocolRates } from "../types"
import { asyncMap, compact } from "../utils/array-fns"
import { defaultConnection } from "../utils/connection"
import { buildAssetRate, buildProtocolRates } from "../utils/rate-fns"

export const fetch = async (
  connection: Connection = defaultConnection("francium")
): Promise<ProtocolRates> => {
  const fr = new FranciumSDK({ connection })

  const assets = await fr.getLendingPoolInfo()

  const rates = await asyncMap(assets, async ({ pool, apy }) => {
    const token = await findTokenBySymbol(pool)

    if (!token) {
      return
    }

    return buildAssetRate({
      token,
      deposit: new Decimal(apy).div(100)
    })
  })

  return buildProtocolRates("francium", rates)
}
